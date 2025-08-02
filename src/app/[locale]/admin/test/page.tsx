"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminTestPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Test Page</h1>
        <p className="text-muted-foreground">
          Test page to verify admin interface is working
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Interface Status</CardTitle>
          <CardDescription>
            This page confirms the admin interface is properly set up
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Admin layout loaded successfully</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Navigation components working</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>UI components loaded</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
