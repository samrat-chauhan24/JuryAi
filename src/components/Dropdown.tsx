import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from 'react-native';

export const Dropdown = ({
  label,
  options,
  selected,
  onSelect,
  openDown = false, // 👈 ONLY new prop
}: any) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ marginRight: 10 }}>
      
      {/* Button */}
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={{
          paddingHorizontal: 5,
          paddingVertical: 5,
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 15,
          backgroundColor: '#fff',
          alignItems: 'center',     // 👈 horizontal center
          justifyContent: 'center', // 👈 vertical center
        }}
      >
        <Text>
          {label && label.trim() !== '' ? `${label}: ` : ''}
          {selected || 'Select'} {openDown ? '▼' : '▲'}
        </Text>
      </TouchableOpacity>

      {/* Overlay to close dropdown */}
      {open && (
        <Pressable
          onPress={() => setOpen(false)}
          style={{
            position: 'absolute',
            top: -1000,
            bottom: -1000,
            left: -1000,
            right: -1000,
            zIndex: 999,
          }}
        />
      )}

      {/* Dropdown Menu */}
      {open && (
        <View
          style={{
            position: 'absolute',

            // 🔥 FIX: shift ONLY for openDown (mode)
            ...(openDown
              ? { right: 0 }   // 👈 Mode dropdown aligns right
              : { left: 0 }), // 👈 Others stay same

            minWidth: 120,
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 10,
            backgroundColor: '#fff',
            zIndex: 1000,
            elevation: 6,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 5,

            ...(openDown
              ? { top: 45 }       // Mode → DOWN
              : { bottom: 45 }),  // Others → UP
          }}
        >
          {options.map((opt: string) => (
            <TouchableOpacity
              key={opt}
              onPress={() => {
                onSelect(opt);
                setOpen(false);
              }}
              style={{
                padding: 10,
                borderBottomWidth: 0.5,
                borderColor: '#eee',
              }}
            >
              <Text>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};