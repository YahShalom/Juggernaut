import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          We offer a wide range of services to help you look and feel your best. From personal styling to wardrobe
          consultations, our team of experts is here to assist you.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <Card>
          <CardContent className="p-8">
            <h3 className="text-2xl font-semibold mb-4">Personal Styling</h3>
            <p className="text-muted-foreground mb-6">
              Our personal stylists will help you create a look that is tailored to your unique style and preferences.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 mr-3 text-primary" />
                <span>One-on-one consultation</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 mr-3 text-primary" />
                <span>Personalized style guide</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 mr-3 text-primary" />
                <span>Shopping assistance</span>
              </li>
            </ul>
            <Button>Book Now</Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-8">
            <h3 className="text-2xl font-semibold mb-4">Wardrobe Consultation</h3>
            <p className="text-muted-foreground mb-6">
              Our wardrobe consultants will help you organize and optimize your closet to make getting dressed a breeze.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 mr-3 text-primary" />
                <span>Closet organization</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 mr-3 text-primary" />
                <span>Outfit planning</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 mr-3 text-primary" />
                <span>Seasonal updates</span>
              </li>
            </ul>
            <Button>Book Now</Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-8">
            <h3 className="text-2xl font-semibold mb-4">Virtual Styling</h3>
            <p className="text-muted-foreground mb-6">
              Get expert style advice from the comfort of your own home with our virtual styling services.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 mr-3 text-primary" />
                <span>Video consultation</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 mr-3 text-primary" />
                <span>Digital lookbook</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 mr-3 text-primary" />
                <span>Personalized shopping links</span>
              </li>
            </ul>
            <Button>Book Now</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
