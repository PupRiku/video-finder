'use client';
import { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';

const SUPPORTED_SITES = {
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
  const [numResults, setNumResults] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBackendReady, setIsBackendReady] = useState(false);

  useEffect(() => {
    const checkStatusAndListen = async () => {
      if (window.api) {
        const isReady = await window.api.checkBackendStatus();
        if (isReady) {
          setIsBackendReady(true);
        }
        window.api.onBackendReady(() => {
          setIsBackendReady(true);
        });
      } else {
        console.warn(
          'Electron API not found, using fallback timer for backend status.'
        );
        setTimeout(() => setIsBackendReady(true), 2000);
      }
    };
    checkStatusAndListen();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Invalid file type. Please select an image.');
        event.target.value = '';
        return;
      }
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setPreviewURL(null);
    document.getElementById('file-upload').value = '';
  };

  const handleClearResults = () => {
    setResults(null);
    setError(null);
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
    formData.append('top_k', numResults);

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
      {isBackendReady ? (
        <>
          <div className="w-full max-w-2xl bg-primary-yellow border-3 border-black shadow-brutal p-6">
            <div className="text-center border-b-3 border-black pb-4 mb-6">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tighter">
                AI Video Frame Finder
              </h1>
              <p className="text-black mt-1">
                Select a site, provide a URL, and upload a screenshot.
              </p>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-accent-blue hover:underline mt-2"
              >
                What can this app do?
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                    data-tooltip-id="pages-tooltip"
                  >
                    Pages to Scrape:
                  </label>
                  <input
                    id="page-input"
                    type="number"
                    value={numPages}
                    onChange={(e) => setNumPages(parseInt(e.target.value, 10))}
                    min="1"
                    data-tooltip-id="pages-tooltip"
                    className="w-full p-2 border-3 border-black shadow-brutal focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="results-input"
                    className="block text-black font-bold mb-2"
                  >
                    Results to Show:
                  </label>
                  <input
                    id="results-input"
                    type="number"
                    value={numResults}
                    onChange={(e) =>
                      setNumResults(parseInt(e.target.value, 10))
                    }
                    min="1"
                    max="10"
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
                {selectedFile && (
                  <button
                    type="button"
                    onClick={handleClearFile}
                    className="w-full sm:w-auto bg-red-500 text-white font-bold py-2 px-4 border-3 border-black shadow-brutal hover:bg-red-700 transition-colors"
                  >
                    Clear
                  </button>
                )}
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
              <div className="flex justify-between items-center border-b-3 border-black pb-2">
                <h2 className="text-2xl font-bold">Results</h2>
                {(results || error) && (
                  <button
                    type="button"
                    onClick={handleClearResults}
                    className="bg-red-500 text-white font-bold text-sm py-1 px-3 border-3 border-black shadow-brutal hover:bg-red-700 transition-colors"
                  >
                    Clear Results
                  </button>
                )}
              </div>
              <div className="mt-4">
                {isLoading && (
                  <p className="text-black font-bold animate-pulse">
                    Searching... this can take a moment.
                  </p>
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
                                    getBackgroundColorForPercentage(
                                      matchPercent
                                    ),
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
          <Tooltip
            id="pages-tooltip"
            place="top"
            content="Heads up: More pages will significantly increase processing time."
          />
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-primary-yellow p-6 border-3 border-black shadow-brutal max-w-lg w-full relative font-mono">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute -top-2 -right-2 bg-white border-3 border-black rounded-full h-8 w-8 flex items-center justify-center text-xl font-bold hover:bg-gray-200"
                  aria-label="Close modal"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-4 border-b-3 border-black pb-2">
                  About This App
                </h2>
                <div className="space-y-3 text-sm">
                  <p>
                    <strong className="font-bold">✅ What it Does:</strong> This
                    app takes a screenshot (a single frame) from a video and
                    searches through the pages of a supported website to find
                    which video that frame appears in.
                  </p>
                  <p>
                    <strong className="font-bold">
                      ❌ What it Doesn&#39;t Do:
                    </strong>{' '}
                    It does not search the entire website, only the number of
                    pages you specify. It does not work for any site not listed
                    in the dropdown. It is not a reverse image search for
                    general images.
                  </p>
                  <p className="pt-4 border-t-2 border-gray-400">
                    <strong className="font-bold">
                      ☕ Support This Project:
                    </strong>{' '}
                    If you find this tool useful, consider supporting its
                    development.
                    <a
                      href="https://www.buymeacoffee.com/PupRiku"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-blue font-bold hover:underline ml-2"
                    >
                      Buy Me a Coffee!
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center">
          <h1 className="text-3xl font-bold animate-pulse">
            Initializing Backend...
          </h1>
          <p>The AI model is loading, please wait.</p>
        </div>
      )}
    </main>
  );
}
