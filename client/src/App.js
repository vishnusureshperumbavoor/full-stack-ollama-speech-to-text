import { useState } from 'react';
import axios from 'axios'
import './App.css';

function App() {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [responseText, setResponseText] = useState('');

  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
  
    recognition.lang = 'en-US';
  
    recognition.onstart = () => {
      setListening(true);
      setTranscript('Listening...');
    };
  
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
      sendTranscriptToServer(transcript);
    };
  
    recognition.onerror = (event) => {
      setTranscript('Error occurred: ' + event.error);
    };
  
    recognition.onend = () => {
      setListening(false);
    };
  
    recognition.start();
  };

  const sendTranscriptToServer = (transcript) => {
    axios.post('http://localhost:5000/chat', { content: transcript })
      .then(response => {
        console.log('chatgpt', response)
        setResponseText(prevResponseText => prevResponseText + response.data);
      })
      .catch(error => {
        console.error('Error sending transcript to server:', error);
      });
  };


  return (
    <div>
      <h1>Speech to Text</h1>
      <button onClick={startRecognition} disabled={listening}>
        {listening ? 'Listening...' : 'Start Recording'}
      </button>
      <p>{transcript}</p>
      <p>{responseText}</p>
    </div>
  );
}

export default App;
