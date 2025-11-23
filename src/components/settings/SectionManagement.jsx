'use client';

import { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ControlGroup from './ControlGroup';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { toastSuccess, toastError } from '@/lib/toast';

const SectionManagement = memo(function SectionManagement({ useSettings }) {
  const { settings, updateSetting } = useSettings();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [newSectionName, setNewSectionName] = useState('');
  const [deletingSection, setDeletingSection] = useState(null);

  // Get sections from settings or use default
  const sections = settings.sections || [];

  const handleAddSection = () => {
    if (!newSectionName.trim()) {
      toastError('Section name is required');
      return;
    }

    // Check for duplicate names
    if (sections.some(s => s.name.toLowerCase() === newSectionName.trim().toLowerCase())) {
      toastError('Section with this name already exists');
      return;
    }

    const updatedSections = [...sections, { name: newSectionName.trim(), order: sections.length }];
    updateSetting('sections', updatedSections);
    setNewSectionName('');
    setIsDialogOpen(false);
    toastSuccess('Section added successfully');
  };

  const handleEditSection = (index) => {
    const section = sections[index];
    setEditingSection(index);
    setNewSectionName(section.name);
    setIsDialogOpen(true);
  };

  const handleUpdateSection = () => {
    if (!newSectionName.trim()) {
      toastError('Section name is required');
      return;
    }

    // Check for duplicate names (excluding current section)
    const duplicateIndex = sections.findIndex(
      (s, i) => i !== editingSection && s.name.toLowerCase() === newSectionName.trim().toLowerCase()
    );
    if (duplicateIndex !== -1) {
      toastError('Section with this name already exists');
      return;
    }

    const updatedSections = [...sections];
    updatedSections[editingSection] = {
      ...updatedSections[editingSection],
      name: newSectionName.trim(),
    };
    updateSetting('sections', updatedSections);
    setEditingSection(null);
    setNewSectionName('');
    setIsDialogOpen(false);
    toastSuccess('Section updated successfully');
  };

  const handleDeleteSection = (index) => {
    const updatedSections = sections.filter((_, i) => i !== index);
    updateSetting('sections', updatedSections);
    setDeletingSection(null);
    toastSuccess('Section deleted successfully');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Menu Sections</h3>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingSection(null);
            setNewSectionName('');
          }
        }}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingSection(null);
                setNewSectionName('');
                setIsDialogOpen(true);
              }}
              className="cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingSection !== null ? 'Edit Section' : 'Add New Section'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Section Name</Label>
                <Input
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="e.g., Appetizers, Main Courses, Desserts"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      editingSection !== null ? handleUpdateSection() : handleAddSection();
                    }
                    if (e.key === 'Escape') {
                      setIsDialogOpen(false);
                    }
                  }}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingSection(null);
                    setNewSectionName('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingSection !== null ? handleUpdateSection : handleAddSection}
                  className="cursor-pointer"
                  disabled={!newSectionName.trim()}
                >
                  {editingSection !== null ? 'Update' : 'Add'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {sections.length > 0 ? (
        <div className="space-y-2">
          {sections.map((section, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <span className="text-sm font-medium text-gray-900">{section.name}</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditSection(index)}
                  className="cursor-pointer"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingSection(index)}
                      className="cursor-pointer text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Section?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{section.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteSection(index)}
                        className="cursor-pointer bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No sections added yet. Add sections to organize your menu.</p>
      )}
    </div>
  );
});

export default SectionManagement;

