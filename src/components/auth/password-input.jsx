'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function getPasswordStrength(password) {
  if (!password) return { level: 0, label: 'Weak', color: 'text-red-600', percentage: 0 };

  let strength = 0;

  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
  if (/\d/.test(password)) strength += 1;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

  const levels = [
    { level: 0, label: 'Very Weak', color: 'text-red-600', percentage: 20 },
    { level: 1, label: 'Weak', color: 'text-red-500', percentage: 40 },
    { level: 2, label: 'Fair', color: 'text-yellow-500', percentage: 60 },
    { level: 3, label: 'Good', color: 'text-blue-500', percentage: 80 },
    { level: 4, label: 'Strong', color: 'text-green-600', percentage: 100 },
    { level: 5, label: 'Very Strong', color: 'text-green-700', percentage: 100 },
  ];

  return levels[Math.min(strength, 5)];
}

export function PasswordInput({ value, onChange, placeholder, required, showStrength = false }) {
  const [showPassword, setShowPassword] = useState(false);
  const strength = showStrength ? getPasswordStrength(value) : null;

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-500" />
          ) : (
            <Eye className="h-4 w-4 text-gray-500" />
          )}
        </Button>
      </div>
      {showStrength && value && (
        <PasswordStrengthIndicator strength={strength} />
      )}
    </div>
  );
}

function PasswordStrengthIndicator({ strength }) {
  const { level, label, color, percentage } = strength;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600">Password strength:</span>
        <span className={`font-medium ${color}`}>{label}</span>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${color.replace('text-', 'bg-')}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}


