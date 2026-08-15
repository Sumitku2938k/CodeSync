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
    new MonacoBinding(
      yText, 
      editorRef.current.getModel(), 
      new Set([editorRef.current]), 
    );
  }

  const handleJoin = (e) => {
    e.preventDefault();
    setUserName(e.target.username.value);
    window.history.pushState({}, "", `?username=${e.target.username.value}`);
  }

  useEffect(() => {
    if (userName) {
      const provider = new SocketIOProvider("http://localhost:3000", "monaco", ydoc, {
        autoConnect: true,
      });

      provider.awareness.setLocalStateField("user", { userName });

      const states = Array.from(provider.awareness.getStates().values());


      setUsers(states.filter(state => state.user && state.user.userName).map(state => state.user));

      provider.awareness.on("change", () => {
        const states = Array.from(provider.awareness.getStates().values());
        setUsers(states.filter(state => state.user && state.user.userName).map(state => state.user));
      });
      
      function handleBeforeUnload() {
        provider.awareness.setLocalStateField("user", null);
      }

      window.addEventListener("beforeunload", handleBeforeUnload);

      
      return () => {
        provider.disconnect();
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [userName]);

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
        <h2 className="text-2xl font-bold p-4 border-gray-300">Users</h2>
        <ul className="p-4">
          {users.map((user, index) => (
            <li key={index} className="mb-2">
              {user.userName}
            </li>
          ))}
        </ul>
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
