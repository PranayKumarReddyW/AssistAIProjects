import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-2xl shadow-xl border border-muted">
        <CardHeader>
          <CardTitle className="text-center text-4xl font-bold text-primary">
            Welcome to Acme Assist AI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-center text-lg text-muted-foreground">
            Acme Assist AI is your smart healthcare companion. Secure, fast, and
            designed for modern clinics and hospitals.
          </p>
          <div className="mb-6">
            <span className="block text-center font-semibold text-primary mb-2">
              Features:
            </span>
            <ul className="list-disc pl-8 text-gray-600">
              <li>Real-time patient management</li>
              <li>Secure video consultations</li>
              <li>Automated transcription and reporting</li>
              <li>Appointment scheduling</li>
              <li>Modern, responsive UI</li>
            </ul>
          </div>
          <div className="flex justify-center">
            <Button
              asChild
              size="lg"
              className="px-8 py-3 text-lg font-semibold"
            >
              <a href="/login">Login to Get Started</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
