'use client';
import { useState } from 'react';

const SUPPORTED_SITES = {
  books_to_scrape: {
    name: 'Books to Scrape (Test Site)',
    baseUrl: 'https://books.toscrape.com/',
  },
  pornhub: {
    name: 'Pornhub Gay',
    baseUrl: 'https://www.pornhub.com/video/gayporn',
  },
};

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [targetSite, setTargetSite] = useState(Object.keys(SUPPORTED_SITES)[0]);
  const [numPages, setNumPages] = useState(1);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('target_url', SUPPORTED_SITES[targetSite].baseUrl);
    formData.append('target_site', targetSite);
    formData.append('num_pages', numPages);

    try {
      const response = await fetch('http://localhost:5000/scrape_and_search', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(
          errData.error || `Server error: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log('Raw API Results:', data);
      setResults(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to the backend.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
            Upload a screenshot and enter a URL to search.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="site-select"
                className="block text-black font-bold mb-2"
              >
                Select Site:
              </label>
              <select
                id="site-select"
                value={targetSite}
                onChange={(e) => setTargetSite(e.target.value)}
                className="w-full p-2 border-3 border-black shadow-brutal focus:outline-none appearance-none"
              >
                {Object.entries(SUPPORTED_SITES).map(([key, site]) => (
                  <option key={key} value={key}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="page-input"
                className="block text-black font-bold mb-2"
              >
                Pages to Scrape:
              </label>
              <input
                id="page-input"
                type="number"
                value={numPages}
                onChange={(e) => setNumPages(e.target.value)}
                min="1"
                max="10" // It's a good idea to set a reasonable max
                className="w-full p-2 border-3 border-black shadow-brutal focus:outline-none"
              />
            </div>
          </div>
          {previewURL && (
            <div className="mb-4 border-3 border-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewURL}
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
              {selectedFile ? selectedFile.name : 'Choose Screenshot...'}
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

        <div className="mt-8">
          <h2 className="text-2xl font-bold border-b-3 border-black pb-2">
            Results
          </h2>
          <div className="mt-4">
            {isLoading && (
              <p>Loading... (Scraping and searching can take a moment)</p>
            )}
            {error && <p className="text-red-500 font-bold">{error}</p>}

            {results && results.length > 0 && (
              <div className="space-y-4">
                {results.map((result) => {
                  const matchPercent = calculateMatchPercentage(
                    result.distance
                  );
                  return (
                    <div
                      key={result.rank}
                      className="bg-white p-3 border-3 border-black flex items-start gap-4"
                    >
                      <a
                        href={result.page_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={result.thumbnail_url}
                          alt={`Thumbnail for match #${result.rank}`}
                          className="w-24 h-auto border-3 border-black"
                        />
                      </a>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center">
                          <p className="font-bold">Rank #{result.rank}</p>
                          <div
                            className="text-black font-bold text-sm py-1 px-2 border-2 border-black"
                            style={{
                              backgroundColor:
                                getBackgroundColorForPercentage(matchPercent),
                            }}
                          >
                            {matchPercent}% Match
                          </div>
                        </div>
                        <a
                          href={result.page_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent-blue hover:underline break-all text-sm"
                        >
                          {result.page_url}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!isLoading && !error && !results && (
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
