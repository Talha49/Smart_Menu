'use client';

import { useTVSettings } from '@/context/TVSettingsContext';
import { Button } from '@/components/ui/button';
import SplitLayout from './SplitLayout';
import ControlsPanel from './ControlsPanel';
import PreviewPanel from './PreviewPanel';
import SectionCard from './SectionCard';
import ColorControls from './ColorControls';
import TypographyControls from './TypographyControls';
import LayoutControls from './LayoutControls';
import HeadingControls from './HeadingControls';
import TextFormatControls from './TextFormatControls';
import BulletPointControls from './BulletPointControls';
import PriceDisplayControls from './PriceDisplayControls';
import CardStyleControls from './CardStyleControls';
import SectionManagement from './SectionManagement';
import ImageUploadControls from './ImageUploadControls';
import TVPreview from './TVPreview';
import { useMemo } from 'react';
import AnimatedContainer from './AnimatedContainer';
import TemplateSelector from './TemplateSelector';
import TemplateBuilder from './TemplateBuilder';
import TemplateManagement from './TemplateManagement';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TVDesignTab({ onSave, isSaving }) {
  const { settings, updateSettings } = useTVSettings();
  const [activeSubTab, setActiveSubTab] = useState('select');
  
  // Create refresh key that changes when settings change
  const refreshKey = useMemo(() => {
    return JSON.stringify(settings);
  }, [settings]);

  const handleSave = async () => {
    try {
      await onSave({ tvSettings: settings });
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const handleTemplateApplied = (result) => {
    if (result.tvSettings) {
      updateSettings(result.tvSettings);
      // Refresh settings from server
      window.location.reload();
    }
  };

  const handleTemplateSaved = () => {
    // Refresh template list
    setActiveSubTab('manage');
  };

  const [showTemplates, setShowTemplates] = useState(false);

  return (
    <div className="h-full flex flex-col">
      {/* Template Section - Collapsible */}
      <div className="mb-4 shrink-0">
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg hover:from-purple-100 hover:to-blue-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Templates</h2>
          </div>
          <ChevronRight 
            className={cn(
              "h-5 w-5 text-gray-600 transition-transform",
              showTemplates && "rotate-90"
            )}
          />
        </button>
        {showTemplates && (
          <Card className="mt-2 p-4 border-purple-200">
            <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="select">Select</TabsTrigger>
                <TabsTrigger value="save">Save</TabsTrigger>
                <TabsTrigger value="manage">Manage</TabsTrigger>
              </TabsList>
              <TabsContent value="select">
                <TemplateSelector
                  category="tv"
                  onTemplateSelect={handleTemplateApplied}
                />
              </TabsContent>
              <TabsContent value="save">
                <TemplateBuilder
                  currentSettings={settings}
                  category="tv"
                  onTemplateSaved={handleTemplateSaved}
                />
              </TabsContent>
              <TabsContent value="manage">
                <TemplateManagement
                  category="tv"
                  onTemplateUpdated={handleTemplateSaved}
                />
              </TabsContent>
            </Tabs>
          </Card>
        )}
      </div>

      {/* Customization Section */}
      <div className="flex-1 min-h-0">
        <SplitLayout
          leftPanel={
            <ControlsPanel
              title="TV Display"
              description="Customize your TV display appearance"
            >
              <Accordion type="multiple" defaultValue={['colors', 'typography']} className="space-y-2">
                <AccordionItem value="colors" className="border border-gray-200 rounded-lg px-4">
                  <AccordionTrigger className="text-left font-semibold">
                    <div>
                      <div>Colors</div>
                      <div className="text-xs font-normal text-gray-500 mt-0.5">Customize the color scheme for TV</div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ColorControls useSettings={useTVSettings} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="typography" className="border border-gray-200 rounded-lg px-4">
                  <AccordionTrigger className="text-left font-semibold">
                    <div>
                      <div>Typography</div>
                      <div className="text-xs font-normal text-gray-500 mt-0.5">Fonts and sizes optimized for TV</div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <TypographyControls useSettings={useTVSettings} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="headings" className="border border-gray-200 rounded-lg px-4">
                  <AccordionTrigger className="text-left font-semibold">
                    <div>
                      <div>Heading Styles</div>
                      <div className="text-xs font-normal text-gray-500 mt-0.5">Customize heading appearance</div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <HeadingControls useSettings={useTVSettings} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="text-format" className="border border-gray-200 rounded-lg px-4">
                  <AccordionTrigger className="text-left font-semibold">
                    <div>
                      <div>Text Formatting</div>
                      <div className="text-xs font-normal text-gray-500 mt-0.5">Bold, italic, and underline options</div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <TextFormatControls useSettings={useTVSettings} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="bullets" className="border border-gray-200 rounded-lg px-4">
                  <AccordionTrigger className="text-left font-semibold">
                    <div>
                      <div>Bullet Points</div>
                      <div className="text-xs font-normal text-gray-500 mt-0.5">Customize bullet point styles</div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <BulletPointControls useSettings={useTVSettings} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="price" className="border border-gray-200 rounded-lg px-4">
                  <AccordionTrigger className="text-left font-semibold">
                    <div>
                      <div>Price Display</div>
                      <div className="text-xs font-normal text-gray-500 mt-0.5">Configure how prices are displayed</div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <PriceDisplayControls useSettings={useTVSettings} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="layout" className="border border-gray-200 rounded-lg px-4">
                  <AccordionTrigger className="text-left font-semibold">
                    <div>
                      <div>Layout</div>
                      <div className="text-xs font-normal text-gray-500 mt-0.5">Display layout and spacing</div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <LayoutControls useSettings={useTVSettings} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="card-style" className="border border-gray-200 rounded-lg px-4">
                  <AccordionTrigger className="text-left font-semibold">
                    <div>
                      <div>Card Styling</div>
                      <div className="text-xs font-normal text-gray-500 mt-0.5">Advanced card customization</div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardStyleControls useSettings={useTVSettings} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="sections" className="border border-gray-200 rounded-lg px-4">
                  <AccordionTrigger className="text-left font-semibold">
                    <div>
                      <div>Menu Sections</div>
                      <div className="text-xs font-normal text-gray-500 mt-0.5">Organize your menu into sections</div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <SectionManagement useSettings={useTVSettings} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="images" className="border border-gray-200 rounded-lg px-4">
                  <AccordionTrigger className="text-left font-semibold">
                    <div>
                      <div>Item Images</div>
                      <div className="text-xs font-normal text-gray-500 mt-0.5">Upload default images for menu items</div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ImageUploadControls useSettings={useTVSettings} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

          {/* Save Button */}
          <AnimatedContainer variant="slideUp" delay={0.4}>
            <div className="sticky bottom-0 pt-6 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
                size="lg"
              >
                {isSaving ? 'Saving...' : 'Save TV Display Settings'}
              </Button>
            </div>
          </AnimatedContainer>
            </ControlsPanel>
          }
          rightPanel={
            <PreviewPanel title="Live TV Display Preview">
              <TVPreview refreshKey={refreshKey} />
            </PreviewPanel>
          }
        />
      </div>
    </div>
  );
}

