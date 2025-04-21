import React, { useState } from 'react';

export interface MoodEmojiPickerProps {
  /** Callback when mood changes */
  onChange: (mood: 'happy' | 'neutral' | 'sad') => void;
  /** Optional initial mood */
  initialMood?: 'happy' | 'neutral' | 'sad';
}

const options: { mood: 'happy' | 'neutral' | 'sad'; label: string }[] = [
  { mood: 'happy', label: '😊' },
  { mood: 'neutral', label: '😐' },
  { mood: 'sad', label: '😟' },
];

export const MoodEmojiPicker: React.FC<MoodEmojiPickerProps> = ({ onChange, initialMood }) => {
  const [selected, setSelected] = useState<'happy' | 'neutral' | 'sad'>(initialMood || 'neutral');

  const handleSelect = (mood: 'happy' | 'neutral' | 'sad') => {
    setSelected(mood);
    onChange(mood);
  };

  return (
    <div className="flex space-x-4">
      {options.map(({ mood, label }) => (
        <button
          key={mood}
          type="button"
          onClick={() => handleSelect(mood)}
          className={`text-2xl focus:outline-none transition-transform transform ${
            selected === mood ? 'scale-125' : 'scale-100 opacity-60'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
