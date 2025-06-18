import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { connectIrys, uploadEventToIrys } from '../lib/irys';

export default function IryspectForm({ iryspectorId, targetId }) {
  const [amount, setAmount] = useState(1);
  const [duration, setDuration] = useState(30); // default to 30 days
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Upload event to IRYS first
      const irys = await connectIrys();
      const irysTxId = await uploadEventToIrys(irys, {
        type: "iryspect",
        iryspector_id: iryspectorId,
        target_id: targetId,
        amount_locked: amount,
        lock_duration: duration,
        timestamp: new Date().toISOString()
      });

      // Then store into Supabase
      const { error } = await supabase.from('iryspects').insert({
        iryspector_id: iryspectorId,
        target_id: targetId,
        amount_locked: amount,
        lock_duration: duration,
        lock_start: new Date().toISOString(),
        is_active: true,
        tx_id: irysTxId
      });

      if (error) {
        console.error('Supabase insert error:', error);
        alert("Failed to submit iryspect");
      } else {
        alert("Iryspect submitted!");
        setAmount(1);
        setDuration(30);
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert("Error submitting iryspect");
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-[#111] p-6 rounded-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-4">IRYSPECT Someone</h2>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Amount to Lock (IRYS)</label>
        <input
          type="number"
          className="w-full p-3 rounded bg-black border border-gray-700 text-white"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          min={0.1}
          step={0.1}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Lock Duration (days)</label>
        <input
          type="number"
          className="w-full p-3 rounded bg-black border border-gray-700 text-white"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          min={7}
          step={1}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full mt-4 py-3 rounded bg-purple-600 text-white font-bold"
      >
        {submitting ? 'Submitting...' : 'Submit IRYSPECT'}
      </button>
    </div>
  );
}
