'use client'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div className="order-2 md:order-1">
          <h3 className="text-2xl font-semibold mb-4">Our Beginnings</h3>
          <p className="mb-4">
            [Tell the story of how your restaurant began. This could include your inspiration, 
            the founders' background, and what motivated you to start this culinary journey.]
          </p>
          <p>
            [Continue with more details about the early days, challenges you overcame, 
            or what makes your origin story special.]
          </p>
        </div>
        <div className="bg-gray-200 aspect-video order-1 md:order-2">
          {/* Placeholder for history image */}
          [HISTORY IMAGE]
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div className="bg-gray-200 aspect-video">
          {/* Placeholder for team image */}
          [TEAM IMAGE]
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-4">Our Team</h3>
          <p className="mb-4">
            [Introduce your team. Highlight key members, their expertise, and what they bring 
            to your restaurant's experience.]
          </p>
          <p>
            [You might mention your chef's background, your service team's philosophy, 
            or how your staff works together to create memorable dining experiences.]
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h3 className="text-2xl font-semibold mb-4">Our Philosophy</h3>
          <p className="mb-4">
            [Explain your culinary philosophy. This could include your approach to ingredients, 
            cooking techniques, menu development, or customer experience.]
          </p>
          <p>
            [Detail any specific commitments like farm-to-table sourcing, sustainability practices, 
            or cultural traditions you honor in your cuisine.]
          </p>
        </div>
        <div className="bg-gray-200 aspect-video">
          {/* Placeholder for philosophy image */}
          [PHILOSOPHY IMAGE]
        </div>
      </div>
    </div>
  )
}