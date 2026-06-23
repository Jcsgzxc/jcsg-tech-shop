'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const reviews = [
  { id: 1, name: 'Mark Angelo', rating: 5, text: 'Keyboard quality is amazing! The RGB lighting is beautiful and the build is top-notch. Fast shipping!' },
  { id: 2, name: 'Jasmine Cruz', rating: 5, text: 'Got a new mouse and it completely changed my gaming experience. Super lightweight and the battery lasts forever!' },
  { id: 3, name: 'Ricardo Ramos', rating: 4, text: 'The PC tune-up service was professional. My old laptop now runs like new! Very affordable prices too.' },
  { id: 4, name: 'Elena Santos', rating: 5, text: 'Best tech shop in town! My new keyboard exceeded my expectations. Will definitely buy again.' },
];

export default function ReviewsSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % reviews.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 glow-text">What Our Customers Say</h2>
        <div className="relative max-w-3xl mx-auto">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${current * 100}%)` }}>
              {reviews.map((review) => (
                <div key={review.id} className="w-full flex-shrink-0 px-8">
                  <div className="bg-card border border-primary/20 rounded-lg p-6 md:p-8">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
                      ))}
                    </div>
                    <p className="text-foreground/90 mb-4 text-lg leading-relaxed">"{review.text}"</p>
                    <p className="font-semibold text-primary">-- {review.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 rounded-full bg-background border border-primary/20 flex items-center justify-center hover:bg-primary/10 transition-colors" aria-label="Previous">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => setCurrent((prev) => (prev + 1) % reviews.length)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 rounded-full bg-background border border-primary/20 flex items-center justify-center hover:bg-primary/10 transition-colors" aria-label="Next">
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="flex justify-center gap-2 mt-6">
            {reviews.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-primary w-6' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'}`} aria-label={`Go to review ${i + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
