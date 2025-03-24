import { useState, useEffect } from 'react';
import { X, Search, MapPin, Target, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: {
    address: string;
    city: string;
    pincode: string;
  }) => void;
  currentLocation?: {
    address: string;
    city: string;
    pincode: string;
  };
}

const LocationModal = ({ 
  isOpen, 
  onClose, 
  onSelectLocation,
  currentLocation
}: LocationModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const { toast } = useToast();

  // Sample saved locations
  const savedLocations = [
    { id: 1, type: 'Home', address: '42 Park Avenue', city: 'Bangalore', pincode: '560001' },
    { id: 2, type: 'Work', address: 'Tech Park, MG Road', city: 'Bangalore', pincode: '560008' },
    { id: 3, type: 'Other', address: 'Phoenix Mall, Whitefield', city: 'Bangalore', pincode: '560066' }
  ];

  // Sample search results based on query
  const searchResults = searchQuery ? [
    { address: `${searchQuery} Heights`, city: 'Bangalore', pincode: '560001' },
    { address: `${searchQuery} Towers, Indiranagar`, city: 'Bangalore', pincode: '560038' },
    { address: `${searchQuery} Residency, Koramangala`, city: 'Bangalore', pincode: '560034' }
  ] : [];

  const detectCurrentLocation = () => {
    setIsDetecting(true);
    
    // In a real app, we would use the browser's geolocation API
    // and then reverse geocode the coordinates to get the address
    
    setTimeout(() => {
      const detectedLocation = {
        address: 'Current Location',
        city: 'Bangalore',
        pincode: '560001'
      };
      
      onSelectLocation(detectedLocation);
      toast({
        title: "Location detected",
        description: `Delivering to ${detectedLocation.address}, ${detectedLocation.city}`,
      });
      
      setIsDetecting(false);
      onClose();
    }, 2000);
  };

  const handleLocationSelect = (location: { address: string; city: string; pincode: string }) => {
    onSelectLocation(location);
    toast({
      title: "Location updated",
      description: `Delivering to ${location.address}, ${location.city}`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden max-h-[90vh] overflow-y-auto" aria-describedby="location-description">
        <DialogTitle className="px-6 pt-6">
          Set Delivery Location
        </DialogTitle>
        <DialogDescription className="px-6" id="location-description">
          Enter your delivery address or use current location
        </DialogDescription>

        <div className="px-6 py-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search for area, street name..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button 
            variant="outline" 
            className="w-full flex items-center justify-start gap-2 mb-6"
            onClick={detectCurrentLocation}
            disabled={isDetecting}
          >
            {isDetecting ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                <span>Detecting your location...</span>
              </>
            ) : (
              <>
                <Target className="h-4 w-4 text-primary" />
                <span>Use current location</span>
              </>
            )}
          </Button>

          {searchQuery && searchResults.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Search Results</h3>
              <div className="space-y-3">
                {searchResults.map((location, index) => (
                  <div 
                    key={index}
                    className="flex items-start p-3 border border-gray-100 rounded-lg cursor-pointer hover:border-gray-300 transition-colors"
                    onClick={() => handleLocationSelect(location)}
                  >
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{location.address}</p>
                      <p className="text-xs text-gray-500">{location.city} - {location.pincode}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {savedLocations.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Saved Locations</h3>
              <div className="space-y-3">
                {savedLocations.map((location) => (
                  <div 
                    key={location.id}
                    className="flex items-start p-3 border border-gray-100 rounded-lg cursor-pointer hover:border-gray-300 transition-colors"
                    onClick={() => handleLocationSelect({
                      address: location.address,
                      city: location.city,
                      pincode: location.pincode
                    })}
                  >
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-neutral mr-3 flex-shrink-0">
                      {location.type === 'Home' ? (
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 21V13H15V21M3 9L12 2L21 9V21H3V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : location.type === 'Work' ? (
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 21H16M12 3V21M20 8V21H4V8L12 3L20 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <Star className="h-3 w-3" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <p className="text-sm font-medium">{location.type}</p>
                        {currentLocation && 
                         currentLocation.address === location.address && 
                         currentLocation.pincode === location.pincode && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Current</span>
                        )}
                      </div>
                      <p className="text-xs">{location.address}</p>
                      <p className="text-xs text-gray-500">{location.city} - {location.pincode}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogClose className="absolute top-4 right-4">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default LocationModal;