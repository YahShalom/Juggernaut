import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function FashionPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Latest Fashion Trends</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Discover our new collection of stylish and comfortable clothing. From casual wear to formal attire, we have
            something for every occasion.
          </p>
          <Button size="lg">
            Shop Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Image
            src="/placeholder.svg"
            alt="Fashion 1"
            width={300}
            height={400}
            className="rounded-lg object-cover w-full aspect-[3/4]"
          />
          <Image
            src="/placeholder.svg"
            alt="Fashion 2"
            width={300}
            height={400}
            className="rounded-lg object-cover w-full aspect-[3/4] mt-8"
          />
        </div>
      </div>
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="p-6">
              <Image
                src="/placeholder.svg"
                alt="Product 1"
                width={400}
                height={500}
                className="rounded-lg object-cover w-full aspect-[4/5] mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Stylish T-Shirt</h3>
              <p className="text-muted-foreground mb-4">A comfortable and versatile t-shirt for everyday wear.</p>
              <Button variant="outline">
                View Product <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Image
                src="/placeholder.svg"
                alt="Product 2"
                width={400}
                height={500}
                className="rounded-lg object-cover w-full aspect-[4/5] mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Classic Jeans</h3>
              <p className="text-muted-foreground mb-4">A timeless pair of jeans that will never go out of style.</p>
              <Button variant="outline">
                View Product <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Image
                src="/placeholder.svg"
                alt="Product 3"
                width={400}
                height={500}
                className="rounded-lg object-cover w-full aspect-[4/5] mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Elegant Dress</h3>
              <p className="text-muted-foreground mb-4">A beautiful dress for special occasions.</p>
              <Button variant="outline">
                View Product <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
