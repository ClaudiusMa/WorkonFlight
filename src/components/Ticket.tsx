import { Card } from '@/components/ui/card'
import { Plane } from 'lucide-react'

export function Ticket() {
  return (
    <>
      {/* Main grid container for ticket layout */}
      <div className="col-span-12 my-20 grid grid-cols-12">
        {/* Main ticket card - left side with perforated edges on the right */}
        <Card
          className="col-span-4 col-start-4 h-80 rounded-none border-r-0 border-dashed bg-[#F1F0EF]"
          style={{
            clipPath: 'inset(0)',
            maskImage:
              'radial-gradient(circle 16px at 100% 100%, transparent 15px, black 16px), radial-gradient(circle 16px at 100% 0, transparent 15px, black 16px)',
            maskComposite: 'intersect',
            WebkitMaskImage:
              'radial-gradient(circle 16px at 100% 100%, transparent 15px, black 16px), radial-gradient(circle 16px at 100% 0, transparent 15px, black 16px)',
            WebkitMaskComposite: 'intersect',
          }}
        >
          {/* Inner padding container */}

          {/* Main content wrapper - flex container to space top and bottom sections */}
          <div className="flex h-full flex-col justify-between p-4 pr-8">
            {/* Top section container - holds From/To airport information */}
            <div className="flex w-full items-center justify-between">
              {/* From section - departure airport info */}
              <div className="flex flex-col items-start gap-4">
                {/* Airport code and city name container */}
                <div className="flex flex-col gap-2">
                  {/* "From:" label */}
                  <p className="text-xs text-muted-foreground">From:</p>
                  {/* Airport code and city container */}
                  <div className="flex flex-col text-[#000988]">
                    {/* Airport code (e.g., PVG) */}
                    <p className="text-3xl font-bold">PVG</p>
                    {/* City name (e.g., Shanghai) */}
                    <p className="text-xl">Shanghai</p>
                  </div>
                </div>
                {/* Departure date and time container */}
                <div className="text-lg">
                  {/* Departure date */}
                  <p>Oct 31</p>
                  {/* Departure time */}
                  <p>10:32 PM</p>
                </div>
              </div>

              {/* Airplane icon - visual separator between From and To */}
              <Plane className="h-9 w-9 rotate-90 text-[#000988]" />

              {/* To section - arrival airport info */}
              <div className="flex flex-col items-start gap-4">
                {/* Airport code and city name container */}
                <div className="flex flex-col gap-2">
                  {/* "To:" label */}
                  <p className="text-xs text-muted-foreground">To:</p>
                  {/* Airport code and city container */}
                  <div className="flex flex-col text-[#000988]">
                    {/* Airport code (e.g., LAX) */}
                    <p className="text-3xl font-bold">LAX</p>
                    {/* City name (e.g., Los Angeles) */}
                    <p className="text-xl">Los Angeles</p>
                  </div>
                </div>
                {/* Arrival date and time container */}
                <div className="text-lg">
                  {/* Arrival date */}
                  <p>Nov 1</p>
                  {/* Arrival time */}
                  <p>00:32 AM</p>
                </div>
              </div>
            </div>

            {/* Bottom section container - flight details row (Name, Terminal, Gate, Flight) */}
            <div className="flex w-full items-start justify-between">
              {/* Name field container */}
              <div className="flex flex-col items-start justify-center gap-1 whitespace-nowrap text-xs">
                {/* "Name:" label */}
                <p className="text-muted-foreground">Name:</p>
                {/* Passenger name value */}
                <p className="text-[#000988]">Claudius</p>
              </div>
              {/* Terminal field container */}
              <div className="flex flex-col items-start justify-center gap-1 whitespace-nowrap text-xs">
                {/* "Terminal:" label */}
                <p className="text-muted-foreground">Terminal:</p>
                {/* Terminal value */}
                <p className="text-[#000988]">T22</p>
              </div>
              {/* Gate field container */}
              <div className="flex flex-col items-start justify-center gap-1 whitespace-nowrap text-xs">
                {/* "Gate:" label */}
                <p className="text-muted-foreground">Gate:</p>
                {/* Gate value */}
                <p className="text-[#000988]">A7</p>
              </div>
              {/* Flight number field container */}
              <div className="flex flex-col items-start justify-center gap-1 whitespace-nowrap text-xs">
                {/* "Flight:" label */}
                <p className="text-muted-foreground">Flight:</p>
                {/* Flight number value */}
                <p className="text-[#000988]">JA 03211</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Ticket stub - right side with perforated edges on the left */}
        <Card
          className="col-span-2 col-start-8 h-80 rounded-none border-l-[1px] border-dashed border-l-gray-400 bg-[#F1F0EF]"
          style={{
            clipPath: 'inset(0)',
            maskImage:
              'radial-gradient(circle 16px at 0 100%, transparent 15px, black 16px), radial-gradient(circle 16px at 0 0, transparent 15px, black 16px)',
            maskComposite: 'intersect',
            WebkitMaskImage:
              'radial-gradient(circle 16px at 0 100%, transparent 15px, black 16px), radial-gradient(circle 16px at 0 0, transparent 15px, black 16px)',
            WebkitMaskComposite: 'intersect',
          }}
        >
          <div className="flex h-full flex-col items-center justify-center gap-3 p-4 pl-8">
            {/* Image container - square aspect ratio */}
            <div className="aspect-square w-20">
              <img
                src="/QRcode.png"
                alt="QR code"
                className="h-full w-full object-cover mix-blend-multiply"
              />
            </div>

            {/* Information container */}
            <div className="flex flex-col gap-2">
              {/* Departure Time section */}
              <div className="flex flex-col items-start">
                <p className="text-xs text-muted-foreground">Departure Time</p>
                <p className="text-base font-semibold">19:40</p>
              </div>

              {/* Destination section */}
              <div className="flex flex-col items-start">
                <p className="text-xs text-muted-foreground">Destination</p>
                <p className="text-base font-semibold">LAX</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
