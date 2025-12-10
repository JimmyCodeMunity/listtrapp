import React, { useState, useEffect } from "react";
import { X, Zap, Clock, TrendingUp, Star } from "lucide-react";
import api from "../lib/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import BoostSuccessModal from "./BoostSuccessModal";

const BoostAdModal = ({ isOpen, onClose, userAds, onBoostSuccess }) => {
  const [boostRates, setBoostRates] = useState([]);
  const [selectedAd, setSelectedAd] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingRates, setLoadingRates] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      fetchBoostRates();
    }
  }, [isOpen]);

  const fetchBoostRates = async () => {
    try {
      setLoadingRates(true);
      const response = await api.get("/boost/rates/active");
      setBoostRates(response.data.data);
    } catch (error) {
      console.error("Error fetching boost rates:", error);
      toast.error("Failed to load boost rates");
    } finally {
      setLoadingRates(false);
    }
  };

  const handleBoostPayment = async () => {
    if (!selectedAd || !selectedDuration) {
      toast.error("Please select an ad and boost duration");
      return;
    }

    const selectedRate = boostRates.find(rate => rate.duration === selectedDuration);
    if (!selectedRate) {
      toast.error("Invalid boost duration selected");
      return;
    }

    if (!user?.user?.email) {
      toast.error("User email not found. Please login again.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/paystack/boost", {
        adId: selectedAd,
        duration: selectedDuration,
        email: user.user.email,
        customerName: user.user.name || user.user.username,
      });

      if (response.data.success) {
        // Use Paystack popup instead of redirect
        const handler = window.PaystackPop.setup({
          key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
          email: user.user.email,
          amount: response.data.data.amountInKobo, // Amount in kobo
          currency: 'KES',
          ref: response.data.data.reference,
          callback: function(response) {
            // Payment successful
            console.log('Payment successful:', response);
            const selectedAdData = userAds.find(ad => ad._id === selectedAd);
            const selectedRateData = boostRates.find(rate => rate.duration === selectedDuration);
            
            setPaymentDetails({
              adTitle: selectedAdData?.title,
              duration: selectedRateData?.displayName,
              amount: selectedRateData?.price,
              reference: response.reference
            });
            
            setShowSuccessModal(true);
            onBoostSuccess();
            onClose();
          },
          onClose: function() {
            // Payment popup closed
            console.log('Payment popup closed');
            toast.info("Payment cancelled");
          }
        });
        
        handler.openIframe();
      } else {
        toast.error(response.data.message || "Failed to initialize payment");
      }
    } catch (error) {
      console.error("Error initializing boost payment:", error);
      toast.error(error.response?.data?.message || "Failed to initialize payment");
    } finally {
      setLoading(false);
    }
  };

  const selectedAdData = userAds.find(ad => ad._id === selectedAd);
  const selectedRateData = boostRates.find(rate => rate.duration === selectedDuration);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Boost Your Ad</h2>
              <p className="text-sm text-gray-500">Get more visibility and reach more customers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Benefits Section */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              Boost Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-orange-500" />
                <span>Priority placement</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <span>Increased visibility</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-500" />
                <span>Featured badge</span>
              </div>
            </div>
          </div>

          {/* Ad Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Ad to Boost
            </label>
            <select
              value={selectedAd}
              onChange={(e) => setSelectedAd(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Choose an ad...</option>
              {userAds
                .filter(ad => !ad.isBoosted)
                .map((ad) => (
                <option key={ad._id} value={ad._id}>
                  {ad.title} - KES {ad.price?.toLocaleString()}
                </option>
              ))}
            </select>
            {userAds.filter(ad => !ad.isBoosted).length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                All your ads are currently boosted or you have no ads to boost.
              </p>
            )}
          </div>

          {/* Selected Ad Preview */}
          {selectedAdData && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-2">Selected Ad Preview</h4>
              <div className="flex gap-4">
                {selectedAdData.images && selectedAdData.images[0] && (
                  <img
                    src={`${import.meta.env.VITE_WS_URL}/${selectedAdData.images[0]}`}
                    alt={selectedAdData.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h5 className="font-medium text-gray-900">{selectedAdData.title}</h5>
                  <p className="text-sm text-gray-600">KES {selectedAdData.price?.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Posted {new Date(selectedAdData.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Boost Duration Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose Boost Duration
            </label>
            {loadingRates ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading boost options...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {boostRates.map((rate) => (
                  <div
                    key={rate.duration}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedDuration === rate.duration
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-300"
                    }`}
                    onClick={() => setSelectedDuration(rate.duration)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{rate.displayName}</h4>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-orange-600 mb-1">
                      KES {rate.price.toLocaleString()}
                    </p>
                    {rate.description && (
                      <p className="text-sm text-gray-600">{rate.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          {selectedRateData && selectedAdData && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Boost Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Ad:</span>
                  <span className="text-blue-900 font-medium">{selectedAdData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Duration:</span>
                  <span className="text-blue-900 font-medium">{selectedRateData.displayName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Cost:</span>
                  <span className="text-blue-900 font-bold">KES {selectedRateData.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleBoostPayment}
            disabled={!selectedAd || !selectedDuration || loading}
            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Proceed to Payment
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Success Modal */}
      <BoostSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        boostDetails={paymentDetails}
      />
    </div>
  );
};

export default BoostAdModal;