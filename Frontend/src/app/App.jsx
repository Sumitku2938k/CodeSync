import "./App.css"
import { Editor } from '@monaco-editor/react';
import { MonacoBinding } from 'y-monaco';
import { useRef, useMemo, useState, useEffect } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";

const App = () => {
  const editorRef = useRef(null);

  const ydoc = useMemo(() => new Y.Doc(), []);
  const yText = useMemo(() => ydoc.getText("monaco"), [ydoc]);

  const [ userName, setUserName ] = useState(() => {
    return new URLSearchParams(window.location.search).get("username") || "";
  });

  const [users, setUsers] = useState([]);

  const handleMount = (editor) => {
    editorRef.current = editor;
  }

  const handleJoin = (e) => {
    e.preventDefault();
    setUserName(e.target.username.value);
    window.history.pushState({}, "", `?username=${e.target.username.value}`);
  }

  useEffect(() => {
    if (username && editorRef.current) {
      const provider = new SocketIOProvider("http://localhost:3000", "monaco", ydoc, {
      autoConnect: true,
    });

    provider.awareness.setLocalStateField("user", { username });
    provider.awareness.on("change", () => {
      const states = Array.from(provider.awareness.getStates().values());
      setUsers(states.map(state => state.user)).filter(user => Boolean(user.username));
    });
    const monacoBinding = new MonacoBinding(
      yText, 
      editorRef.current.getModel(), 
      new Set([editorRef.current]), 
      provider.awareness
    );
    }
  }, [editorRef.current, username]);

  if (!userName) {
    return (
      <main className="h-screen w-full bg-gray-950 flex gap-4 p-4 items-center justify-center">
        <form onSubmit={handleJoin} className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-white mb-4">Enter your username</h1>
          <input
            type="text"
            className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Username"
            name="username"
            required
          />
          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Join
          </button>
        </form>
      </main>
    );
  }
  return (
    <main className="h-screen w-full bg-gray-950 flex gap-4 p-4">
      <aside className="h-full w-1/4 bg-amber-50 rounded-lg">
        
      </aside>
      <section className="w-3/4 bg-neutral-800 rounded-lg overflow-hidden">  
        <Editor
          height="100%"
          width="100%"
          defaultLanguage="javascript"
          defaultValue="// Write your code here"
          theme="vs-dark"
          onMount={handleMount}
        />
      </section>
    </main>
  );
}

export default App;
