import React, { useState } from "react";

function Gemini() {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false); // To handle modal visibility

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!prompt) {
            setError("Please provide a prompt.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:8000/a1/get-gemini-response/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong.");
            } else {
                setResponse(data.response);
            }
        } catch (err) {
            setError("Error connecting to the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            {/* Button to open modal */}
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                onClick={() => setShowModal(true)}
            >
                Gemini
            </button>

            {/* Modal */}
            {showModal && (
                <div className="fixed bottom-0 right-0 w-full sm:w-1/3 p-4">
                    <div className="bg-white shadow-lg rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Gemini - AI Text Generator</h2>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setShowModal(false)}
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <textarea
                                className="w-full mt-4 p-2 border rounded"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Enter your prompt..."
                                rows="4"
                            />
                            <br />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 mt-2 rounded shadow hover:bg-blue-700"
                                disabled={loading}
                            >
                                {loading ? "Generating..." : "Submit"}
                            </button>
                        </form>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                        {response && (
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold">Generated Response:</h3>
                                <p>{response}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Gemini;
