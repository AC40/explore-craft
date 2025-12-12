"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Shield,
  Zap,
  FolderTree,
  CheckSquare2,
  FileText,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Explore Craft API
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A local-first browser application to explore and navigate your
              Craft workspace through the Craft API. Everything runs in your
              browser—no data ever leaves your device.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button asChild size="lg">
                <Link href="/">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>100% Local</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  All data processing happens in your browser. No server, no
                  cloud, no data collection.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Fast & Responsive</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Aggressive caching keeps everything snappy. Your data persists
                  across sessions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FolderTree className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Full Workspace Access</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Browse folders, documents, and tasks. Navigate your entire
                  Craft space with ease.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Features</h2>
              <p className="text-muted-foreground">
                Everything you need to explore your Craft workspace
              </p>
            </div>

            <div className="space-y-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="relative aspect-video rounded-lg border bg-muted overflow-hidden order-2 md:order-1">
                  <Image
                    src="/img/get-document-ids.png"
                    alt="Document Management - Viewing and copying document IDs"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="space-y-4 order-1 md:order-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-6 w-6 text-primary" />
                    <h3 className="text-2xl font-semibold">
                      Document Management
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    View all your documents in one place. Access selected
                    documents or browse through your entire space. Copy document
                    IDs with a single click.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-6 w-6 text-primary" />
                    <h3 className="text-2xl font-semibold">Document Content</h3>
                  </div>
                  <p className="text-muted-foreground">
                    View document blocks and content in a structured format.
                    Switch between block view and raw JSON, copy block IDs, and
                    explore your document structure.
                  </p>
                </div>
                <div className="relative aspect-video rounded-lg border bg-muted overflow-hidden">
                  <Image
                    src="/img/view-doc-content.png"
                    alt="Document Content View - Viewing document blocks and content"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckSquare2 className="h-6 w-6 text-primary" />
                    <h3 className="text-2xl font-semibold">
                      Tasks & Daily Notes
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    Manage your tasks across different scopes: active, upcoming,
                    inbox, and logbook. View task details, schedules, and
                    deadlines all in one interface.
                  </p>
                </div>
                <div className="relative aspect-video rounded-lg border bg-muted overflow-hidden">
                  <Image
                    src="/img/tasks.png"
                    alt="Tasks View - Managing tasks and daily notes"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-12 space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Connect to your Craft space using the Craft API. All connections
                are stored locally in your browser. No account required, no data
                collection.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="text-2xl font-bold text-primary mb-2">1</div>
                  <CardTitle>Connect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription>
                    Add your Craft space URL and optional API key. Choose from
                    folders, documents, or tasks.
                  </CardDescription>
                  <div className="relative aspect-video rounded-lg border bg-muted overflow-hidden">
                    <Image
                      src="/img/manage-connections.png"
                      alt="Manage Connections - Adding and configuring Craft connections"
                      fill
                      className="object-contain"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="text-2xl font-bold text-primary mb-2">2</div>
                  <CardTitle>Explore</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Navigate your workspace through the sidebar. Browse folders,
                    view documents, and manage tasks.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="text-2xl font-bold text-primary mb-2">3</div>
                  <CardTitle>Stay Local</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Everything is cached locally for fast access. Your data
                    never leaves your browser.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="border-t pt-12 text-center space-y-4">
            <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
            <p className="text-muted-foreground">
              Connect to your Craft workspace and start exploring
            </p>
            <Button asChild size="lg">
              <Link href="/">
                Connect Your Space
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
