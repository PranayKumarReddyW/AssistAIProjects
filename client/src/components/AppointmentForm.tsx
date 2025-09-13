import React, { useState } from "react";

interface AppointmentFormProps {
  userId: string;
  doctors: Array<{ id: string; name: string }>;
  onBooked?: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  userId,
  doctors,
  onBooked,
}) => {
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const API_BASE = "http://localhost:9000/api";
      const res = await fetch(`${API_BASE}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: userId, doctorId, date, time }),
      });
      if (!res.ok) throw new Error("Failed to book appointment");
      setSuccess(true);
      setDate("");
      setTime("");
      if (onBooked) onBooked();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 border rounded bg-white"
    >
      <h2 className="text-lg font-semibold mb-4">Book Appointment</h2>
      <div className="mb-3">
        <label className="block mb-1">Doctor</label>
        <select
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        >
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="block mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded px-2 py-1 w-full"
          required
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1">Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border rounded px-2 py-1 w-full"
          required
        />
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && (
        <div className="text-green-500 mb-2">Appointment booked!</div>
      )}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Booking..." : "Book Appointment"}
      </button>
    </form>
  );
};

export default AppointmentForm;
