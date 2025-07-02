import  { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
import { firestore } from "../firebase/config";
import { motion } from 'framer-motion';
import { Download, Mic } from 'lucide-react';
import jsPDF from 'jspdf';

const TextEditor = () => {
  const [text, setText] = useState('');
  const { isSignedIn, user } = useAuth();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en-US'); // Default language is English
  const [userDocuments, setUserDocuments] = useState([]);
  const synth = window.speechSynthesis;

  // Initialize SpeechRecognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false; // Stop after one sentence
  recognition.interimResults = false; // Only return final results
  recognition.lang = language; // Set language

  useEffect(() => {
    const fetchUserDocuments = async () => {
      if (isSignedIn && user) {
        const userRef = doc(firestore, "users", user.id);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserDocuments(userData.documents || []);
        }
      }
    };

    if (isSignedIn) {
      fetchUserDocuments();
    }
  }, [isSignedIn, user]);

  const speakText = () => {
    if (synth.speaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

    if (text.trim() !== '') {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      synth.speak(utterance);
    }
  };

  const startListening = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    recognition.start();
    setIsListening(true);
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setText(prev => prev + ' ' + transcript);
    setIsListening(false);
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    setIsListening(false);
  };

  recognition.onend = () => {
    setIsListening(false);
  };

  const saveDocument = async () => {
    if (!isSignedIn || !user || !text.trim()) return;

    try {
      const documentData = {
        title: `Document ${userDocuments.length + 1}`,
        content: text,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: user.id
      };

      // Add to Firestore
      const docRef = await addDoc(collection(firestore, "documents"), documentData);
      
      // Update user's documents list
      const updatedDocuments = [...userDocuments, { id: docRef.id, ...documentData }];
      setUserDocuments(updatedDocuments);
      
      // Update user profile with new document reference
      const userRef = doc(firestore, "users", user.id);
      await setDoc(userRef, { documents: updatedDocuments }, { merge: true });

      alert('Document saved successfully!');
    } catch (error) {
      console.error('Error saving document:', error);
      alert('Failed to save document');
    }
  };

  const downloadPDF = () => {
    if (text.trim() === '') {
      alert('Please enter some text before downloading');
      return;
    }

    const doc = new jsPDF();
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 15, 15);
    doc.save('document.pdf');
  };

  const clearText = () => {
    setText('');
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please login to use the Text Editor</h2>
          <a 
            href="/login" 
            className="bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-400 transition duration-300"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Text Editor
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create, edit, and save your documents with voice input and text-to-speech capabilities.
            </p>
          </div>

          {/* Language Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language for Speech Recognition & Text-to-Speech
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
              <option value="de-DE">German</option>
              <option value="it-IT">Italian</option>
              <option value="pt-BR">Portuguese (Brazil)</option>
              <option value="ru-RU">Russian</option>
              <option value="ja-JP">Japanese</option>
              <option value="ko-KR">Korean</option>
              <option value="zh-CN">Chinese (Simplified)</option>
              <option value="ar-SA">Arabic</option>
              <option value="hi-IN">Hindi</option>
            </select>
          </div>

          {/* Text Editor */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Document Content
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={speakText}
                  className={`p-2 rounded-lg transition-colors ${
                    isSpeaking
                      ? 'bg-red-500 text-white'
                      : 'bg-yellow-500 text-black hover:bg-yellow-400'
                  }`}
                  title={isSpeaking ? 'Stop Speaking' : 'Text to Speech'}
                >
                  <Mic size={20} />
                </button>
                <button
                  onClick={startListening}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening
                      ? 'bg-red-500 text-white'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  title={isListening ? 'Stop Listening' : 'Voice Input'}
                >
                  <Mic size={20} />
                </button>
              </div>
            </div>
            
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing or use voice input..."
              className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {text.length} characters, {text.split(' ').filter(word => word.length > 0).length} words
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={clearText}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={saveDocument}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={downloadPDF}
                  className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors flex items-center space-x-2"
                >
                  <Download size={16} />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* Saved Documents */}
          {userDocuments.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Saved Documents ({userDocuments.length})
              </h2>
              <div className="space-y-3">
                {userDocuments.map((doc, index) => (
                  <div
                    key={doc.id || index}
                    className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => setText(doc.content)}
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {doc.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {doc.content.substring(0, 100)}...
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      Created: {doc.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TextEditor;