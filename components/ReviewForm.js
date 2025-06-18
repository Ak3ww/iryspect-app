import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { connectIrys, uploadEventToIrys } from '../lib/irys';

export default function ReviewForm({ reviewerId, targetId }) {
  const [score, setScore] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Upload event to IRYS first
      const irys = await connectIrys();
      const irysTxId = await uploadEventToIrys(irys, {
        type: "review",
        reviewer_id: reviewerId,
        target_id: targetId,
        score: score,
        review_text: reviewText,
        timestamp: new Date().toISO
