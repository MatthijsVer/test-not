import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Plus, X, Edit2, Check } from "lucide-react";

export interface TabData {
  id: string;
  label: string;
  content: string;
  icon?: string;
}

interface TabsBlockProps {
  tabs: TabData[];
  onTabsChange: (tabs: TabData[]) => void;
  readOnly?: boolean;
}

export const TabsBlock: React.FC<TabsBlockProps> = ({
  tabs,
  onTabsChange,
  readOnly = false,
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");
  const [editingTab, setEditingTab] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");

  const addTab = () => {
    const newTab: TabData = {
      id: `tab-${Date.now()}`,
      label: `Tab ${tabs.length + 1}`,
      content: "",
    };
    const updatedTabs = [...tabs, newTab];
    onTabsChange(updatedTabs);
    setActiveTab(newTab.id);
  };

  const removeTab = (tabId: string) => {
    if (tabs.length <= 1) return; // Keep at least one tab
    
    const updatedTabs = tabs.filter((tab) => tab.id !== tabId);
    onTabsChange(updatedTabs);
    
    // If removing active tab, switch to first available
    if (activeTab === tabId && updatedTabs.length > 0) {
      setActiveTab(updatedTabs[0].id);
    }
  };

  const startEditingTab = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (tab) {
      setEditingTab(tabId);
      setEditLabel(tab.label);
    }
  };

  const saveTabLabel = (tabId: string) => {
    const updatedTabs = tabs.map((tab) =>
      tab.id === tabId ? { ...tab, label: editLabel } : tab
    );
    onTabsChange(updatedTabs);
    setEditingTab(null);
  };

  const updateTabContent = (tabId: string, content: string) => {
    const updatedTabs = tabs.map((tab) =>
      tab.id === tabId ? { ...tab, content } : tab
    );
    onTabsChange(updatedTabs);
  };

  if (tabs.length === 0) {
    return (
      <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
        <p className="text-muted-foreground text-sm mb-2">No tabs created yet</p>
        {!readOnly && (
          <Button onClick={addTab} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add First Tab
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center">
            <TabsList className="h-auto p-1 bg-transparent">
              {tabs.map((tab) => (
                <div key={tab.id} className="flex items-center group">
                  <TabsTrigger
                    value={tab.id}
                    className="relative pr-8 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                  >
                    {editingTab === tab.id ? (
                      <div className="flex items-center space-x-1">
                        <Input
                          value={editLabel}
                          onChange={(e) => setEditLabel(e.target.value)}
                          className="h-6 px-1 text-xs w-20"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveTabLabel(tab.id);
                            if (e.key === "Escape") setEditingTab(null);
                          }}
                          autoFocus
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-5 w-5 p-0"
                          onClick={() => saveTabLabel(tab.id)}
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <span className="flex items-center">
                        {tab.icon && <span className="mr-1">{tab.icon}</span>}
                        {tab.label}
                      </span>
                    )}
                  </TabsTrigger>
                  {!readOnly && (
                    <div className="absolute -right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity flex">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditingTab(tab.id);
                        }}
                      >
                        <Edit2 className="w-2 h-2" />
                      </Button>
                      {tabs.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-4 w-4 p-0 hover:bg-red-200 dark:hover:bg-red-900"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeTab(tab.id);
                          }}
                        >
                          <X className="w-2 h-2" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </TabsList>
            {!readOnly && (
              <Button
                onClick={addTab}
                size="sm"
                variant="ghost"
                className="ml-2 h-8 px-2"
              >
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="p-4 min-h-[200px]">
            {readOnly ? (
              <div className="prose dark:prose-invert max-w-none">
                {tab.content || <p className="text-muted-foreground">Empty tab</p>}
              </div>
            ) : (
              <textarea
                value={tab.content}
                onChange={(e) => updateTabContent(tab.id, e.target.value)}
                placeholder="Enter tab content..."
                className="w-full min-h-[150px] p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};