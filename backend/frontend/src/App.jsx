import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import StudentTable from './components/StudentTable';
import StudentProfile from './components/StudentProfile';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<StudentTable />} />
        <Route path="student/:id" element={<StudentProfile />} />
      </Route>
    </Routes>
  );
}

export default App;