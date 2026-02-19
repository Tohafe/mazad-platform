import Gallery from './components/Gallery/Gallery';

const itemImages = [
  "https://images.unsplash.com/photo-1720423514789-15a33e59fc81?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1610177498573-78deaa4a797b?q=80&w=2393&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?q=80&w=2380&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1597589827317-4c6d6e0a90bd?q=80&w=2380&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

// src/App.tsx

// src/App.tsx
// src/App.tsx
function App() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="h-16 border-b mb-6" /> 

      <main className="max-w-6xl mx-auto px-4 lg:px-8">

        <div className="flex flex-col lg:flex-row items-start">
          {/* GALLERY WITH BLEED: 
              - Desktop (lg): -ml-[180px] pushes it left.
              - Mobile: ml-0 keeps it aligned.
          */}
         <main className="max-w-2xl mx-auto px-8">
            <div className="-ml-[180px]"> {/* The Bleed Wrapper */}
              <Gallery 
                images={itemImages} 
                title="Pokémon - 1 Graded card - Charizard #4 Foil - PSA 7 - WOTC" 
                altText="Charizard Card" 
              />
            </div>
          </main>

          {/* BIDDING PANEL AREA:
              - This area stays aligned to the 'horizontal line' of the page border
          */}
          <div className="w-full lg:w-[380px] lg:ml-auto border-l lg:pl-8">
             <div className="w-full h-[450px] border-2 border-dashed border-gray-100 rounded-lg flex items-center justify-center text-gray-300">
                Bidding Panel Area
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
export default App
