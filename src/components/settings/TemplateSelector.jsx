'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Check, Sparkles, Image as ImageIcon } from 'lucide-react';
import { toastSuccess, toastError } from '@/lib/toast';
import useSWR from 'swr';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function TemplateSelector({ onTemplateSelect, category = 'both' }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const { data, isLoading, mutate } = useSWR(
    `/api/templates?category=${category}`,
    fetcher
  );

  const defaultTemplates = data?.defaultTemplates || [];
  const customTemplates = data?.customTemplates || [];

  const handleApplyTemplate = async (template) => {
    try {
      setIsApplying(true);

      const response = await fetch('/api/templates/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: template._id,
          applyTo: category,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to apply template');
      }

      toastSuccess(`Template "${template.name}" applied successfully!`);
      setSelectedTemplate(template._id);
      
      // Call callback to refresh settings
      if (onTemplateSelect) {
        onTemplateSelect(result);
      }
    } catch (error) {
      console.error('Apply template error:', error);
      toastError(error.message || 'Failed to apply template');
    } finally {
      setIsApplying(false);
    }
  };

  const handlePreview = (template) => {
    setPreviewTemplate(template);
    setShowPreview(true);
  };

  const TemplateCard = ({ template, isCustom = false }) => (
    <Card
      className={`p-4 cursor-pointer transition-all hover:shadow-lg border-2 ${
        selectedTemplate === template._id
          ? 'border-purple-600 bg-purple-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="space-y-3">
        {/* Thumbnail */}
        <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300">
          {template.thumbnail ? (
            <img
              src={template.thumbnail}
              alt={template.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
          )}
          {template.isDefault && (
            <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Default
            </div>
          )}
          {selectedTemplate === template._id && (
            <div className="absolute inset-0 bg-purple-600 bg-opacity-20 flex items-center justify-center">
              <div className="bg-purple-600 text-white rounded-full p-2">
                <Check className="h-5 w-5" />
              </div>
            </div>
          )}
        </div>

        {/* Template Info */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
          <p className="text-xs text-gray-600 line-clamp-2">{template.description}</p>
          {template.category !== 'both' && (
            <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {template.category === 'menu' ? 'Menu Only' : 'TV Only'}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePreview(template)}
            className="flex-1 cursor-pointer"
          >
            Preview
          </Button>
          <Button
            size="sm"
            onClick={() => handleApplyTemplate(template)}
            disabled={isApplying || selectedTemplate === template._id}
            className="flex-1 cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {selectedTemplate === template._id ? 'Applied' : 'Apply'}
          </Button>
        </div>
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-semibold text-gray-900 mb-2 block">
          Select a Template
        </Label>
        <p className="text-sm text-gray-600">
          Choose a pre-designed template or use your custom templates. Click "Apply" to use it.
        </p>
      </div>

      <Tabs defaultValue="default" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="default">Default Templates</TabsTrigger>
          <TabsTrigger value="custom">My Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="default" className="mt-4">
          {defaultTemplates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {defaultTemplates.map((template) => (
                <TemplateCard key={template._id} template={template} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No default templates available.</p>
              <p className="text-sm mt-2">Run `npm run seed:templates` to add default templates.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="custom" className="mt-4">
          {customTemplates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {customTemplates.map((template) => (
                <TemplateCard key={template._id} template={template} isCustom />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No custom templates yet.</p>
              <p className="text-sm mt-2">Create a template from your current settings.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{previewTemplate?.name}</DialogTitle>
            <DialogDescription>{previewTemplate?.description}</DialogDescription>
          </DialogHeader>
          {previewTemplate && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="font-semibold">Colors</Label>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: previewTemplate.settings.backgroundColor }}
                      />
                      <span>Background</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: previewTemplate.settings.textColor }}
                      />
                      <span>Text</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: previewTemplate.settings.accentColor }}
                      />
                      <span>Accent</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="font-semibold">Typography</Label>
                  <div className="mt-2 space-y-1">
                    <p>Font: {previewTemplate.settings.fontFamily}</p>
                    <p>Heading: {previewTemplate.settings.headingSize}</p>
                    <p>Body: {previewTemplate.settings.bodySize}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    handleApplyTemplate(previewTemplate);
                    setShowPreview(false);
                  }}
                  className="cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Apply Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

