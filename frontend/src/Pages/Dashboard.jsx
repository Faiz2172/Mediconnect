import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase/config";
import { 
  Activity, Heart, Clock, Calendar, Bell, 
  User, PlusCircle, Settings, PieChart,
  Pill, TrendingUp, Watch, BarChart2
} from "lucide-react";
import HeartRateWidget from "../Components/HeartRateWidget";
import StressLevelWidget from "../Components/StressLevelWidget";
import MedicationReminders from "../Components/MedicationReminders";
import DeviceConnector from "../Components/DeviceConnector";
import HealthSummary from "../Components/HealthSummary";
import GoogleFitConnect from "../Components/GoogleFitConnect";

const Dashboard = () => {
  const { isSignedIn, isLoaded, user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState(null);
  const [isGoogleFitConnected, setIsGoogleFitConnected] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isSignedIn && user) {
        const userRef = doc(firestore, "users", user.id);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setUserData(userSnap.data());
          setIsGoogleFitConnected(userSnap.data().googleFitConnected || false);
          setConnectedDevices(userSnap.data().connectedDevices || []);
        } else {
          // Create user profile if it doesn't exist
          const newUserData = {
            displayName: user.fullName || user.firstName || "",
            email: user.primaryEmailAddress?.emailAddress || "",
            photoURL: user.imageUrl || "",
            googleFitConnected: false,
            connectedDevices: [],
            createdAt: new Date()
          };
          await setDoc(userRef, newUserData);
          setUserData(newUserData);
        }
      }
    };

    if (isLoaded && isSignedIn) {
      fetchUserData();
    }
  }, [isSignedIn, isLoaded, user]);

  if (!isLoaded) {
    return (
      <div className="container mx-auto mt-24 p-4 flex justify-center items-center h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-20 h-20 bg-yellow-400 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-48 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="container mx-auto mt-24 p-4 flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please login to view your dashboard</h2>
          <a 
            href="/login" 
            className="bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-400 transition duration-300"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-20">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 shadow-md">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                {user?.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-yellow-500">
                    {user?.firstName ? user.firstName[0].toUpperCase() : 
                     user?.primaryEmailAddress?.emailAddress ? user.primaryEmailAddress.emailAddress[0].toUpperCase() : 'U'}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Welcome, {user?.fullName || user?.firstName || user?.primaryEmailAddress?.emailAddress?.split('@')[0]}
                </h1>
                <p className="text-yellow-100">Track your health with CarePulse</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="bg-white text-yellow-600 px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-yellow-100 transition duration-300">
                <Settings size={18} />
                <span>Settings</span>
              </button>
              <button className="bg-white text-yellow-600 px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-yellow-100 transition duration-300">
                <User size={18} />
                <span>Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            <TabButton 
              active={activeTab === "overview"} 
              onClick={() => setActiveTab("overview")}
              icon={<PieChart size={18} />}
              label="Overview"
            />
            <TabButton 
              active={activeTab === "health"} 
              onClick={() => setActiveTab("health")}
              icon={<Heart size={18} />}
              label="Heart Rate"
            />
            <TabButton 
              active={activeTab === "stress"} 
              onClick={() => setActiveTab("stress")}
              icon={<Activity size={18} />}
              label="Stress Level"
            />
            <TabButton 
              active={activeTab === "medications"} 
              onClick={() => setActiveTab("medications")}
              icon={<Pill size={18} />}
              label="Medications"
            />
            <TabButton 
              active={activeTab === "devices"} 
              onClick={() => setActiveTab("devices")}
              icon={<Watch size={18} />}
              label="Devices"
            />
            <TabButton 
              active={activeTab === "stats"} 
              onClick={() => setActiveTab("stats")}
              icon={<BarChart2 size={18} />}
              label="Health Stats"
            />
          </div>
        </div>

        {/* Google Fit Connection Banner (shows only if not connected) */}
        {!isGoogleFitConnected && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <TrendingUp size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Connect Google Fit to sync your health data</h3>
                  <p className="text-blue-700 text-sm">Get heart rate, stress levels, and activity data from your Mi Band 5</p>
                </div>
              </div>
              <GoogleFitConnect 
                onConnect={() => setIsGoogleFitConnected(true)} 
                userId={user?.id}
              />
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === "overview" && (
            <>
              <HealthSummary isGoogleFitConnected={isGoogleFitConnected} />
              <HeartRateWidget isGoogleFitConnected={isGoogleFitConnected} />
              <MedicationReminders 
                userId={user?.id} 
                limit={3} 
                showAddButton={true} 
              />
            </>
          )}

          {activeTab === "health" && (
            <>
              <HeartRateWidget isGoogleFitConnected={isGoogleFitConnected} />
              <div className="md:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Heart className="mr-2 text-red-500" />
                    Heart Rate History
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Detailed heart rate monitoring and trends will be displayed here.
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === "stress" && (
            <>
              <StressLevelWidget isGoogleFitConnected={isGoogleFitConnected} />
              <div className="md:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Activity className="mr-2 text-orange-500" />
                    Stress Level Analysis
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Stress level tracking and recommendations will be displayed here.
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === "medications" && (
            <div className="md:col-span-3">
              <MedicationReminders 
                userId={user?.id} 
                limit={10} 
                showAddButton={true} 
              />
            </div>
          )}

          {activeTab === "devices" && (
            <div className="md:col-span-3">
              <DeviceConnector 
                userId={user?.id}
                connectedDevices={connectedDevices}
                onDeviceUpdate={setConnectedDevices}
              />
            </div>
          )}

          {activeTab === "stats" && (
            <div className="md:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <BarChart2 className="mr-2 text-blue-500" />
                  Health Statistics
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Comprehensive health statistics and analytics will be displayed here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition duration-300 ${
        active
          ? "bg-yellow-500 text-white shadow-md"
          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-gray-700"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default Dashboard;