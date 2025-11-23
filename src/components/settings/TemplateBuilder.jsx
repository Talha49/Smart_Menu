'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Save, Sparkles } from 'lucide-react';
import { toastSuccess, toastError } from '@/lib/toast';
import { useAuthStore } from '@/lib/store';

export default function TemplateBuilder({ currentSettings, category = 'both', onTemplateSaved }) {
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const plan = useAuthStore((state) => state.plan);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toastError('Template name is required');
      return;
    }

    if (plan !== 'pro') {
      toastError('Pro plan required to create custom templates');
      setIsOpen(false);
      return;
    }

    try {
      setSaving(true);

      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          settings: currentSettings,
          category,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save template');
      }

      toastSuccess(`Template "${formData.name}" saved successfully!`);
      setIsOpen(false);
      setFormData({ name: '', description: '' });
      
      if (onTemplateSaved) {
        onTemplateSaved(data);
      }
    } catch (error) {
      console.error('Save template error:', error);
      toastError(error.message || 'Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  if (plan !== 'pro') {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          <Sparkles className="h-4 w-4 inline mr-2" />
          Upgrade to Pro to create and save custom templates.
        </p>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full cursor-pointer flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save as Template
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Current Settings as Template</DialogTitle>
          <DialogDescription>
            Save your current customization settings as a reusable template. You can apply it later or share it with others.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name *</Label>
            <Input
              id="template-name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., My Restaurant Style"
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="template-description">Description (Optional)</Label>
            <Input
              id="template-description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe this template..."
              maxLength={500}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !formData.name.trim()}
              className="cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {saving ? 'Saving...' : 'Save Template'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

