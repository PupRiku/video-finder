'use client';
import { useState } from 'react';

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [groupedResults, setGroupedResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const groupResultsByVideo = (results) => {
    return results.reduce((acc, result) => {
      const video = result.video_source;
      if (!acc[video]) {
        acc[video] = [];
      }
      acc[video].push(result);
      return acc;
    }, {});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGroupedResults(null);
    const formData = new FormData();
    formData.append('image', selectedFile);
    try {
      const response = await fetch('http://localhost:5000/search', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Raw API Results:', data);
      setGroupedResults(groupResultsByVideo(data));
    } catch (err) {
      setError('Failed to connect to the backend. Is it running?');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  };

  const getVideoFilename = (path) => {
    return path.split('\\').pop().split('/').pop();
  };

  const calculateMatchPercentage = (distance) => {
    const percentage = Math.max(0, distance) * 100;
    return Math.round(percentage);
  };

  const getBackgroundColorForPercentage = (percentage) => {
    const red = Math.round(255 * (1 - percentage / 100));
    const green = Math.round(255 * (percentage / 100));
    return `rgb(${red}, ${green}, 0)`;
  };

  return (
    <main className="bg-off-white min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 font-mono">
      <div className="w-full max-w-2xl bg-primary-yellow border-3 border-black shadow-brutal p-6">
        <div className="text-center border-b-3 border-black pb-4 mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tighter">
            AI Video Frame Finder
          </h1>
          <p className="text-black mt-1">
            Upload a screenshot. Find the source.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          {previewUrl && (
            <div className="mb-4 border-3 border-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Selected preview"
                className="max-w-full h-auto"
              />
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label
              htmlFor="file-upload"
              className="w-full sm:w-auto flex-shrink-0 cursor-pointer bg-white text-black font-bold py-2 px-4 border-3 border-black shadow-brutal hover:bg-gray-200 transition-colors text-center"
            >
              {selectedFile ? selectedFile.name : 'Choose File...'}
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto flex-grow bg-accent-blue text-white font-bold py-2 px-6 border-3 border-black shadow-brutal hover:bg-blue-700 transition-colors disabled:bg-gray-500"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
        {/* --- Results Section --- */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold border-b-3 border-black pb-2">
            Results
          </h2>
          <div className="mt-4">
            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-500 font-bold">{error}</p>}

            {groupedResults && Object.keys(groupedResults).length > 0 && (
              <div className="space-y-6">
                {Object.entries(groupedResults).map(([videoSource, frames]) => {
                  const bestFrame = frames[0];
                  const videoMatchPercent = calculateMatchPercentage(
                    bestFrame.distance
                  );

                  return (
                    <div
                      key={videoSource}
                      className="bg-white p-3 border-3 border-black"
                    >
                      <div className="flex justify-between items-center border-b-2 border-gray-200 pb-2 mb-2">
                        <h3 className="font-bold text-lg text-accent-blue">
                          {getVideoFilename(videoSource)}
                        </h3>
                        <div
                          className="text-black font-bold text-sm py-1 px-2 border-2 border-black"
                          style={{
                            backgroundColor:
                              getBackgroundColorForPercentage(
                                videoMatchPercent
                              ),
                          }}
                        >
                          {videoMatchPercent}% Match
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-3">
                        {frames.map((frame) => {
                          const frameMatchPercent = calculateMatchPercentage(
                            frame.distance
                          );
                          return (
                            <div key={frame.rank}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={`http://localhost:5000/${frame.filename}`}
                                alt={`Matched frame from ${getVideoFilename(
                                  videoSource
                                )}`}
                                className="border-3 border-black w-full h-auto"
                              />
                              <div className="flex justify-between items-center mt-1">
                                <p className="text-sm font-bold">
                                  Rank #{frame.rank}
                                </p>
                                <div
                                  className="text-black font-bold text-xs py-0.5 px-1 border-2 border-black"
                                  style={{
                                    backgroundColor:
                                      getBackgroundColorForPercentage(
                                        frameMatchPercent
                                      ),
                                  }}
                                >
                                  {frameMatchPercent}%
                                </div>
                              </div>
                              <p className="text-xs text-gray-600">
                                ~{formatTimestamp(frame.timestamp)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!isLoading && !error && !groupedResults && (
              <p className="text-gray-600">
                Search results will appear here...
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
