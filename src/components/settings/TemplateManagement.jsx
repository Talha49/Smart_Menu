'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import { toastSuccess, toastError } from '@/lib/toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function TemplateManagement({ category = 'both', onTemplateUpdated }) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const { data, mutate } = useSWR(
    `/api/templates?category=${category}`,
    fetcher
  );

  const customTemplates = data?.customTemplates || [];

  const handleEdit = (template) => {
    setEditingId(template._id);
    setEditName(template.name);
    setEditDescription(template.description || '');
  };

  const handleSaveEdit = async (templateId) => {
    if (!editName.trim()) {
      toastError('Template name is required');
      return;
    }

    try {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName.trim(),
          description: editDescription.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update template');
      }

      toastSuccess('Template updated successfully!');
      setEditingId(null);
      setEditName('');
      setEditDescription('');
      mutate();
      
      if (onTemplateUpdated) {
        onTemplateUpdated();
      }
    } catch (error) {
      console.error('Update template error:', error);
      toastError(error.message || 'Failed to update template');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  };

  const handleDelete = async (templateId, templateName) => {
    try {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete template');
      }

      toastSuccess(`Template "${templateName}" deleted successfully!`);
      mutate();
      
      if (onTemplateUpdated) {
        onTemplateUpdated();
      }
    } catch (error) {
      console.error('Delete template error:', error);
      toastError(error.message || 'Failed to delete template');
    }
  };

  if (customTemplates.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No custom templates yet.</p>
        <p className="text-sm mt-2">Save your current settings as a template to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold text-gray-900">My Custom Templates</Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {customTemplates.map((template) => (
          <Card key={template._id} className="p-4">
            {editingId === template._id ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Template name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Template description"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSaveEdit(template._id)}
                    className="flex-1 cursor-pointer"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="flex-1 cursor-pointer"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                  {template.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">{template.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(template)}
                    className="flex-1 cursor-pointer"
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Template?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{template.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(template._id, template.name)}
                          className="cursor-pointer bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

