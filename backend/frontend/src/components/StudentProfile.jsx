import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const StudentProfile = () => {
  const { id } = useParams();
  const [contests, setContests] = useState([]);
  const [stats, setStats] = useState(null);
  const [contestDays, setContestDays] = useState(90);
  const [problemDays, setProblemDays] = useState(30);

  const fetchContestHistory = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/students/${id}/contests?days=${contestDays}`);
      setContests(res.data.contests);
    } catch (err) {
      console.error('Failed to fetch contest history', err);
    }
  }, [id, contestDays]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/students/${id}/stats?days=${problemDays}`);
      setStats(res.data.stats);
    } catch (err) {
      console.error('Failed to fetch problem stats', err);
    }
  }, [id, problemDays]);

  useEffect(() => {
    fetchContestHistory();
  }, [fetchContestHistory]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Student Profile</h2>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Contest History</h3>
          <select value={contestDays} onChange={(e) => setContestDays(Number(e.target.value))} className="border p-1">
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last 365 days</option>
          </select>
        </div>
        {contests.length === 0 ? (
          <p className="text-gray-500">No contest data found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Contest</th>
                  <th className="p-2 border">New Rating</th>
                  <th className="p-2 border">Change</th>
                  <th className="p-2 border">Rank</th>
                  <th className="p-2 border">Unsolved</th>
                  <th className="p-2 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {contests.map((c, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2 border">{c.contestName}</td>
                    <td className="p-2 border">{c.newRating}</td>
                    <td className="p-2 border">{c.ratingChange}</td>
                    <td className="p-2 border">{c.rank}</td>
                    <td className="p-2 border">{c.unsolvedProblems}</td>
                    <td className="p-2 border">{new Date(c.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Problem Solving Data</h3>
          <select value={problemDays} onChange={(e) => setProblemDays(Number(e.target.value))} className="border p-1">
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {!stats ? (
          <p className="text-gray-500">No stats available.</p>
        ) : (
          <div className="space-y-4">
            <p>Total Solved: <strong>{stats.total}</strong></p>
            <p>Average Rating: <strong>{Math.round(stats.avgRating)}</strong></p>
            <p>Avg. Problems/Day: <strong>{stats.avgPerDay.toFixed(2)}</strong></p>
            <p>Most Difficult Problem: <a href={stats.mostDifficult.link} target="_blank" rel="noreferrer" className="text-blue-600 underline">{stats.mostDifficult.name} ({stats.mostDifficult.rating})</a></p>

            <div className="mt-6">
              <h4 className="font-semibold mb-2">Problems by Rating</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={Object.entries(stats.ratingBuckets).map(([key, value]) => ({ rating: key, count: value }))}>
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3182ce" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-2">Submission Heatmap</h4>
              <div className="grid grid-cols-7 gap-1 text-xs">
                {Object.entries(stats.heatmap).map(([date, count], i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: `rgba(66, 153, 225, ${Math.min(count / 5, 1)})` }}
                    title={`${date}: ${count} submissions`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default StudentProfile;
