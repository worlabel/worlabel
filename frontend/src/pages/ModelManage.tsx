import { Book, Bot, CornerDownLeft, LifeBuoy, Settings, SquareUser, Triangle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

export const description =
  'An auto-labeling dashboard with a sidebar navigation and a main content area. The dashboard has a header with settings and data upload options. The sidebar has navigation links and user menu. The main content area shows a form to configure the labeling process and datasets.';

export default function ModelManage() {
  return (
    <TooltipProvider>
      <div className="grid h-screen w-full overflow-hidden pl-[56px]">
        <aside className="sticky inset-y-0 left-0 z-20 flex h-full flex-col border-r">
          <div className="border-b p-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="Home"
            >
              <Triangle className="fill-foreground size-5" />
            </Button>
          </div>
          <nav className="grid gap-1 p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg"
                  aria-label="Labeling"
                >
                  <Bot className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={5}
              >
                Labeling
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg"
                  aria-label="Datasets"
                >
                  <Book className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={5}
              >
                Datasets
              </TooltipContent>
            </Tooltip>
          </nav>
          <nav className="mt-auto grid gap-1 p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-auto rounded-lg"
                  aria-label="Help"
                >
                  <LifeBuoy className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={5}
              >
                Help
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-auto rounded-lg"
                  aria-label="Account"
                >
                  <SquareUser className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={5}
              >
                Account
              </TooltipContent>
            </Tooltip>
          </nav>
        </aside>
        <div className="flex flex-col">
          <header className="bg-background sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b px-4">
            <h1 className="text-xl font-semibold">Auto Labeling</h1>
            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                >
                  <Settings className="size-4" />
                  <span className="sr-only">Settings</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[80vh]">
                <DrawerHeader>
                  <DrawerTitle>Configuration</DrawerTitle>
                  <DrawerDescription>Configure the settings for the labeling process.</DrawerDescription>
                </DrawerHeader>
                <form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
                  <fieldset className="grid gap-6 rounded-lg border p-4">
                    <legend className="-ml-1 px-1 text-sm font-medium">Labeling Settings</legend>
                    <div className="grid gap-3">
                      <Label htmlFor="dataset">Dataset</Label>
                      <Select>
                        <SelectTrigger
                          id="dataset"
                          className="items-start"
                        >
                          <SelectValue placeholder="Select a dataset" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dataset1">Dataset 1</SelectItem>
                          <SelectItem value="dataset2">Dataset 2</SelectItem>
                          <SelectItem value="dataset3">Dataset 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="label-type">Label Type</Label>
                      <Select>
                        <SelectTrigger
                          id="label-type"
                          className="items-start"
                        >
                          <SelectValue placeholder="Select a label type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bounding-box">Bounding Box</SelectItem>
                          <SelectItem value="segmentation">Segmentation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </fieldset>
                </form>
              </DrawerContent>
            </Drawer>
          </header>
          <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-muted/50 relative flex h-full min-h-[50vh] flex-col rounded-xl p-4 lg:col-span-2">
              <Badge
                variant="outline"
                className="absolute right-3 top-3"
              >
                Labeling Results
              </Badge>
              <div className="flex-1" />
              <form className="bg-background focus-within:ring-ring relative overflow-hidden rounded-lg border focus-within:ring-1">
                <Label
                  htmlFor="upload"
                  className="sr-only"
                >
                  Upload File
                </Label>
                <Input
                  id="upload"
                  type="file"
                  className="min-h-12"
                />
                <div className="flex items-center p-3 pt-0">
                  <Button
                    type="submit"
                    size="sm"
                    className="ml-auto gap-1.5"
                  >
                    Start Labeling
                    <CornerDownLeft className="size-3.5" />
                  </Button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
