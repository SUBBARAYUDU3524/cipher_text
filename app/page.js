"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function PlayfairCipher() {
  const [encryptionPlaintext, setEncryptionPlaintext] = useState("");
  const [encryptionKey, setEncryptionKey] = useState("");
  const [ciphertext, setCiphertext] = useState("");

  const [decryptionCiphertext, setDecryptionCiphertext] = useState("");
  const [decryptionKey, setDecryptionKey] = useState("");
  const [decryptedText, setDecryptedText] = useState("");

  // Function to create the Playfair cipher matrix
  const createMatrix = (key) => {
    const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ"; // J is merged with I
    key = key.toUpperCase().replace(/J/g, "I");
    const matrix = [];
    const used = new Set();

    for (const char of key + alphabet) {
      if (!used.has(char)) {
        used.add(char);
        matrix.push(char);
        if (matrix.length === 25) break;
      }
    }

    const grid = [];
    for (let i = 0; i < 25; i += 5) {
      grid.push(matrix.slice(i, i + 5));
    }
    return grid;
  };

  const preprocessText = (text, addPadding = true) => {
    text = text.toUpperCase().replace(/J/g, "I").replace(/\s+/g, "");
    const processed = [];

    for (let i = 0; i < text.length; i++) {
      if (i + 1 < text.length && text[i] === text[i + 1]) {
        processed.push(text[i] + "X");
      } else if (i + 1 < text.length) {
        processed.push(text[i] + text[i + 1]);
        i++;
      } else if (addPadding) {
        processed.push(text[i] + "X");
      } else {
        processed.push(text[i]);
      }
    }

    return processed;
  };

  const findPosition = (matrix, char) => {
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (matrix[row][col] === char) return { row, col };
      }
    }
    return null;
  };

  const encryptPair = (pair, matrix) => {
    const { row: r1, col: c1 } = findPosition(matrix, pair[0]);
    const { row: r2, col: c2 } = findPosition(matrix, pair[1]);

    if (r1 === r2) {
      return matrix[r1][(c1 + 1) % 5] + matrix[r2][(c2 + 1) % 5];
    } else if (c1 === c2) {
      return matrix[(r1 + 1) % 5][c1] + matrix[(r2 + 1) % 5][c2];
    } else {
      return matrix[r1][c2] + matrix[r2][c1];
    }
  };

  const decryptPair = (pair, matrix) => {
    const { row: r1, col: c1 } = findPosition(matrix, pair[0]);
    const { row: r2, col: c2 } = findPosition(matrix, pair[1]);

    if (r1 === r2) {
      return matrix[r1][(c1 + 4) % 5] + matrix[r2][(c2 + 4) % 5];
    } else if (c1 === c2) {
      return matrix[(r1 + 4) % 5][c1] + matrix[(r2 + 4) % 5][c2];
    } else {
      return matrix[r1][c2] + matrix[r2][c1];
    }
  };

  const playfairEncrypt = (plaintext, key) => {
    const matrix = createMatrix(key);
    const pairs = preprocessText(plaintext, true);
    return pairs.map((pair) => encryptPair(pair, matrix)).join("");
  };

  const playfairDecrypt = (ciphertext, key) => {
    const matrix = createMatrix(key);
    const pairs = preprocessText(ciphertext, false);
    let decrypted = pairs.map((pair) => decryptPair(pair, matrix)).join("");

    decrypted = decrypted.replace(/([A-Z])X(?=[A-Z])/g, "$1");
    if (decrypted.endsWith("X")) {
      decrypted = decrypted.slice(0, -1);
    }

    return decrypted;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold mb-6">Playfair Cipher</h1>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={{
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
        }}
        className="bg-white shadow-xl p-6 rounded-lg mb-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">
          Encryption
        </h2>
        <label className="block mb-2">
          Key:
          <input
            type="text"
            value={encryptionKey}
            onChange={(e) => setEncryptionKey(e.target.value)}
            className="border w-full p-2 rounded mt-1"
            placeholder="Enter key"
          />
        </label>
        <label className="block mb-4">
          Plaintext:
          <input
            type="text"
            value={encryptionPlaintext}
            onChange={(e) => setEncryptionPlaintext(e.target.value)}
            className="border w-full p-2 rounded mt-1"
            placeholder="Enter plaintext"
          />
        </label>
        <button
          onClick={() =>
            setCiphertext(playfairEncrypt(encryptionPlaintext, encryptionKey))
          }
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Encrypt
        </button>
        {ciphertext && (
          <div className="mt-4">
            <h3 className="text-lg font-bold">Ciphertext:</h3>
            <p className="text-gray-700">{ciphertext}</p>
          </div>
        )}
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={{
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
        }}
        className="bg-white shadow-xl p-6 rounded-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-green-600">
          Decryption
        </h2>
        <label className="block mb-2">
          Key:
          <input
            type="text"
            value={decryptionKey}
            onChange={(e) => setDecryptionKey(e.target.value)}
            className="border w-full p-2 rounded mt-1"
            placeholder="Enter key"
          />
        </label>
        <label className="block mb-4">
          Ciphertext:
          <input
            type="text"
            value={decryptionCiphertext}
            onChange={(e) => setDecryptionCiphertext(e.target.value)}
            className="border w-full p-2 rounded mt-1"
            placeholder="Enter ciphertext"
          />
        </label>
        <button
          onClick={() =>
            setDecryptedText(
              playfairDecrypt(decryptionCiphertext, decryptionKey)
            )
          }
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Decrypt
        </button>
        {decryptedText && (
          <div className="mt-4">
            <h3 className="text-lg font-bold">Decrypted Text:</h3>
            <p className="text-gray-700">{decryptedText}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
