import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, Activity, Settings, Heart, Stethoscope, ClipboardList, DollarSign } from "lucide-react"
import Link from "next/link"

export default function DashboardHome() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Heart className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">EHR Dashboard</h1>
                <p className="text-sm text-muted-foreground">Healthcare Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Oracle Connected
              </Badge>
              <Button variant="outline" size="sm" asChild>
                <Link href="/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome to Your EHR Dashboard</h2>
          <p className="text-lg text-muted-foreground">
            Manage patients, appointments, clinical operations, and billing from one centralized platform.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today&apos;s Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">3 pending confirmations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Encounters</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">2 in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Bills</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,450</div>
              <p className="text-xs text-muted-foreground">15 outstanding invoices</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Patient Management</CardTitle>
                  <CardDescription>Search, view, and manage patient records</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-muted-foreground">• Search patient records</p>
                <p className="text-sm text-muted-foreground">• View medical history</p>
                <p className="text-sm text-muted-foreground">• Update demographics</p>
                <p className="text-sm text-muted-foreground">• Manage allergies & conditions</p>
              </div>
              <Button className="w-full" asChild>
                <Link href="/patients">Access Patients</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>Appointment Scheduling</CardTitle>
                  <CardDescription>Manage appointments and provider schedules</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-muted-foreground">• View daily schedules</p>
                <p className="text-sm text-muted-foreground">• Book new appointments</p>
                <p className="text-sm text-muted-foreground">• Reschedule & cancel</p>
                <p className="text-sm text-muted-foreground">• Check availability</p>
              </div>
              <Button className="w-full" asChild>
                <Link href="/appointments">Manage Appointments</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                  <Stethoscope className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle>Clinical Operations</CardTitle>
                  <CardDescription>Clinical notes, vitals, and diagnostics</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-muted-foreground">• Add clinical notes</p>
                <p className="text-sm text-muted-foreground">• Record vital signs</p>
                <p className="text-sm text-muted-foreground">• View lab results</p>
                <p className="text-sm text-muted-foreground">• Manage medications</p>
              </div>
              <Button className="w-full" asChild>
                <Link href="/clinical">Clinical Dashboard</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle>Billing & Administrative</CardTitle>
                  <CardDescription>Insurance, billing, and financial management</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-muted-foreground">• Check insurance eligibility</p>
                <p className="text-sm text-muted-foreground">• View patient balances</p>
                <p className="text-sm text-muted-foreground">• Generate reports</p>
                <p className="text-sm text-muted-foreground">• Billing codes</p>
              </div>
              <Button className="w-full" asChild>
                <Link href="/billing">Billing Dashboard</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
                  <Settings className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <CardTitle>API Configuration</CardTitle>
                  <CardDescription>Test connections and manage settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-muted-foreground">• Test API connections</p>
                <p className="text-sm text-muted-foreground">• Generate Postman collections</p>
                <p className="text-sm text-muted-foreground">• Environment settings</p>
                <p className="text-sm text-muted-foreground">• Authentication status</p>
              </div>
              <Button className="w-full" asChild>
                <Link href="/settings">API Settings</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-lg">
                  <ClipboardList className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <CardTitle>API Testing Tools</CardTitle>
                  <CardDescription>Test and validate FHIR operations</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-muted-foreground">• Test FHIR endpoints</p>
                <p className="text-sm text-muted-foreground">• Validate resources</p>
                <p className="text-sm text-muted-foreground">• Debug API calls</p>
                <p className="text-sm text-muted-foreground">• Export test collections</p>
              </div>
              <Button className="w-full" asChild>
                <Link href="/settings/testing">Testing Tools</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current connection and system health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Oracle FHIR API: Connected</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Authentication: Active</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Last Sync: 5 minutes ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
