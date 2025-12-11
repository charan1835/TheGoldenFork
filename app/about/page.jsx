'use client'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">

      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-4">Our Story</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Bringing the authentic soul of South India to your plate, one spice at a time.
        </p>
      </div>

      {/* Beginnings Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="order-2 md:order-1">
          <h3 className="text-3xl font-semibold text-orange-700 mb-6">Our Humble Beginnings</h3>
          <p className="mb-4 text-gray-700 leading-relaxed">
            It all started in a small, sun-drenched village in Kerala, where the aroma of roasting spices and freshly ground coconut filled the air every morning. Our founder, inspired by his grandmother's kitchen—a place where food was a language of love—dreamed of sharing these timeless flavors with the world.
          </p>
          <p className="text-gray-700 leading-relaxed">
            The GoldenFork was born from a desire to recreate that authentic experience. From a modest stall serving just chai and vada, we have grown into a culinary destination, but our heart remains the same: rooted in tradition, driven by passion, and dedicated to the art of South Indian hospitality.
          </p>
        </div>
        <div className="relative aspect-video order-1 md:order-2 rounded-2xl overflow-hidden shadow-xl border-4 border-orange-100">
          <Image
            src="/about/history.png"
            alt="Vintage photo of our first restaurant"
            fill
            className="object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>

      {/* Team Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl border-4 border-orange-100">
          <Image
            src="/about/team.png"
            alt="Our chefs in the kitchen"
            fill
            className="object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div>
          <h3 className="text-3xl font-semibold text-orange-700 mb-6">The Hands Behind the Magic</h3>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Our kitchen is a symphony of rhythm and flavor, led by chefs who have mastered their craft over decades. They don't just cook; they orchestrate a culinary performance. Each member of our team brings a deep respect for traditional techniques, from the precise tempering of mustard seeds to the slow-cooking of our signature biryanis.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We believe that happy hands make delicious food. That's why our team is more than just staff—we are a family, united by a shared love for feeding people and seeing the joy on their faces with every bite.
          </p>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h3 className="text-3xl font-semibold text-orange-700 mb-6">Our Philosophy: Atithi Devo Bhava</h3>
          <p className="mb-4 text-gray-700 leading-relaxed">
            "The Guest is God." This ancient Sanskrit verse is the cornerstone of our service. At GoldenFork, we don't just serve food; we serve memories. We believe in the sanctity of fresh ingredients, sourcing our spices directly from farmers in the Western Ghats and our vegetables from local growers.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We are committed to sustainability and authenticity. No shortcuts, no artificial preservatives—just pure, wholesome food prepared with the same care and devotion as a meal cooked at home. This is our promise to you.
          </p>
        </div>
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl border-4 border-orange-100">
          <Image
            src="/about/philosophy.png"
            alt="Traditional South Indian meal"
            fill
            className="object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>

      {/* Footer Quote */}
      <div className="mt-24 text-center">
        <p className="text-2xl font-serif italic text-gray-500">
          "Food is not just fuel, it's an emotion."
        </p>
      </div>
    </div>
  )
}