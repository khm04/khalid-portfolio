import { Route, Switch } from "wouter";
import { Toaster } from "sonner";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/admin/Login";
import AdminGuard from "@/pages/admin/AdminGuard";
import AdminLayout from "@/pages/admin/AdminLayout";
import Overview from "@/pages/admin/Overview";
import MessagesPage from "@/pages/admin/messages/MessagesPage";
import FramesPage from "@/pages/admin/frames/FramesPage";
import VideosPage from "@/pages/admin/videos/VideosPage";
import CertificatesPage from "@/pages/admin/certificates/CertificatesPage";
import TestimonialsPage from "@/pages/admin/testimonials/TestimonialsPage";
import SettingsPage from "@/pages/admin/settings/SettingsPage";
import GenresPage from "@/pages/admin/genres/GenresPage";

function AdminApp() {
  return (
    <AdminGuard>
      <AdminLayout>
        <Switch>
          <Route path="/admin"              component={Overview} />
          <Route path="/admin/messages"     component={MessagesPage} />
          <Route path="/admin/frames"       component={FramesPage} />
          <Route path="/admin/videos"       component={VideosPage} />
          <Route path="/admin/certificates" component={CertificatesPage} />
          <Route path="/admin/testimonials" component={TestimonialsPage} />
          <Route path="/admin/genres"       component={GenresPage} />
          <Route path="/admin/settings"    component={SettingsPage} />
          <Route component={NotFound} />
        </Switch>
      </AdminLayout>
    </AdminGuard>
  );
}

export default function App() {
  return (
    <>
      <Switch>
        <Route path="/"            component={Home} />
        <Route path="/admin/login" component={Login} />
        <Route path="/admin" component={AdminApp} />
        <Route path="/admin/:rest*" component={AdminApp} />
        <Route component={NotFound} />
      </Switch>
      <Toaster position="bottom-right" theme="dark" />
    </>
  );
}
