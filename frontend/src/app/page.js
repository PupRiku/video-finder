'use client';
import { useState } from 'react';

export default function HomePage() {
  // State to hold the selected file and search results
  const [selectedFile, setSelectedFile] = useState(null);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }
    // We will add the API call logic here in the next step
    console.log('Submitting file:', selectedFile.name);
  };

  return (
    <main className="bg-off-white min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 font-mono">
      <div className="w-full max-w-2xl bg-primary-yellow border-3 border-black shadow-brutal p-6">
        {/* Header */}
        <div className="text-center border-b-3 border-black pb-4 mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tighter">
            AI Video Frame Finder
          </h1>
          <p className="text-black mt-1">
            Upload a screenshot. Find the source.
          </p>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label
              htmlFor="file-upload"
              className="w-full sm:w-auto flex-shrink-0 cursor-pointer bg-white text-black font-bold py-2 px-4 border-3 border-black shadow-brutal hover:bg-gray-200 transition-colors"
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
              className="w-full sm:w-auto flex-grow bg-accent-blue text-white font-bold py-2 px-6 border-3 border-black shadow-brutal hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Results Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold border-b-3 border-black pb-2">
            Results
          </h2>
          <div className="mt-4">
            {/* We will map over and display results here */}
            <p className="text-gray-600">Search results will appear here...</p>
          </div>
        </div>
      </div>
    </main>
  );
}
