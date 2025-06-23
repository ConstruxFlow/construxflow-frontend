import React from "react";
import NavBar from "../components/NavBar";
import { MdOutlineStorage } from "react-icons/md";
import FeaturesCard from "../components/HomePage/FeaturesCard";
import { FaRobot } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa6";
import { FaWarehouse } from "react-icons/fa";
import { FaArrowUpLong } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa6";
import { FaBuilding } from "react-icons/fa6";
import { GrStatusGood } from "react-icons/gr";
import { IoMail } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import InsightsCard from "../components/HomePage/InsightsCard";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigation=useNavigate();

  const handlelogin=()=>{
    navigation("/login");
  }

  return (
    <div className="bg-main_dark flex flex-col items-center justify-center w-full">
      <NavBar
        links={[
          { name: "Home", href: "#" },
          { name: "Features", href: "#" },
          { name: "Insights", href: "#" },
          { name: "Contact", href: "#" },
        ]}
        showButton={true}
        onButtonClick={handlelogin}
      />
      <div className="relative w-full md:h-[calc(100vh-70px)] h-[calc(100vh-50px)] overflow-hidden">
        <img
          src="/assets/home_page/hero.jpg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, #191919 0%, rgba(25, 25, 25, 0.90) 50%, rgba(0, 0, 0, 0) 100%)",
          }}
        />
        <div className="relative z-10 flex justify-between items-center h-full">
          <div className="w-1/2 flex flex-col gap-8 justify-center items-start pl-10">
            <h1 className="text-purewhite font-extrabold text-7xl">
              Seamless Projects, One Powerful Platform
            </h1>
            <p className="text-light_gray text-lg w-[500px]">
              All-in-one platform for inventory, procurement, and
              maintenance—built for seamless construction project management.
            </p>
            <div className="flex gap-4">
              <button className="bg-web_yellow font-medium text-main_dark px-6 py-3 rounded hover:bg-yellow-500 transition-colors">
                Start Managing Today
              </button>
              <button className="bg-transparent border font-medium border-deep_green text-deep_green px-6 py-3 rounded ">
                Learn More
              </button>
            </div>
          </div>
          <div className="w-1/2 md:flex hidden justify-center items-center">
            <img
              src="/assets/home_page/hero2.jpg"
              alt="Hero"
              className="w-[680px] h-[450px] rounded-xl shadow-xl"
            />
            {/* Liquid glass cards */}
            <div className="absolute left-[750px] top-[380px] w-[152px] h-[86px]  bg-[#1A1A1A]/40 rounded-[16px] border border-white/20 shadow-[0_4px_32px_0_rgba(0,0,0,0.25)] backdrop-blur-sm backdrop-saturate-150  overflow-hidden">
              <div className="absolute inset-0 flex flex-col gap-1 items-center justify-center text-white pointer-events-none">
                <p className="text-deep_green font-bold text-xl">500+</p>
                <p className="font-light">Happy Clients</p>
                <div className="absolute top-2 left-2 w-2/3 h-1/4 bg-white/20 rounded-full blur-lg"></div>
                <div className="absolute bottom-2 right-2 w-1/3 h-1/6 bg-white/10 rounded-full blur"></div>
              </div>
            </div>
            <div className="absolute right-[300px] bottom-[85px] w-[152px] h-[86px]  bg-[#1A1A1A]/40 rounded-[16px] border border-white/20 shadow-[0_4px_32px_0_rgba(0,0,0,0.25)] backdrop-blur-sm backdrop-saturate-150  overflow-hidden">
              <div className="absolute inset-0 flex flex-col gap-1 items-center justify-center text-white pointer-events-none">
                <p className="text-web_yellow font-bold text-xl">640+</p>
                <p className="font-light">Active Workers</p>
                <div className="absolute top-2 left-2 w-2/3 h-1/4 bg-white/20 rounded-full blur-lg"></div>
                <div className="absolute bottom-2 right-2 w-1/3 h-1/6 bg-white/10 rounded-full blur"></div>
              </div>
            </div>
            <div className="absolute right-4 top-[90px] w-[152px] h-[86px]  bg-[#1A1A1A]/40 rounded-[16px] border border-white/20 shadow-[0_4px_32px_0_rgba(0,0,0,0.25)] backdrop-blur-sm backdrop-saturate-150  overflow-hidden">
              <div className="absolute inset-0 flex flex-col gap-1 items-center justify-center text-white pointer-events-none">
                <p className="text-web_yellow font-bold text-xl">150+</p>
                <p className="font-light">Projects Finished</p>
                <div className="absolute top-2 left-2 w-2/3 h-1/4 bg-white/20 rounded-full blur-lg"></div>
                <div className="absolute bottom-2 right-2 w-1/3 h-1/6 bg-white/10 rounded-full blur"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Features Section */}
      <div className="w-full py-10 flex flex-col gap-3 items-center">
        <p className="text-purewhite text-3xl">
          Powerful Features for Construction Teams
        </p>
        <p className="text-light_gray text-base w-[540px] text-center">
          Everything you need to manage inventory, track procurement, and
          coordinate maintenance across your construction projects.
        </p>
        <div className="flex w-full px-28 pt-5 justify-between">
          <FeaturesCard
            icon={MdOutlineStorage}
            title="Inventory Management"
            description="Optimize material ordering, track deliveries, and manage warehouse operations with intelligent automation."
          />
          <FeaturesCard
            icon={FaRobot}
            iconBg="bg-web_yellow"
            title="Automated Ordering"
            description="Set minimum stock levels and let the system automatically generate purchase orders when inventory runs low."
          />
          <FeaturesCard
            icon={FaChartLine}
            title="Real-Time Tracking"
            description="Monitor inventory levels, track deliveries, and get instant updates on material availability across all your construction sites."
          />
        </div>
      </div>
      {/* Insights Section */}
      <div className="w-full py-10 flex flex-col gap-3 items-center">
        <p className="text-purewhite text-3xl">
          Real-Time Construction Insights
        </p>
        <p className="text-light_gray text-base w-[400px] text-center">
          See the pulse of your projects and supply chain at a glance.
        </p>
        <div className="flex w-full px-28 pt-5 justify-between">
          <InsightsCard
            icon={FaChartLine}
            title="Real-Time Tracking"
            main_percentage="75%"
            percentage="12%"
            plus={true}
            iconBg="bg-deep_green"
            bordercolor="border-deep_green/50"
          />
          <InsightsCard
            icon={GrStatusGood}
            title="Order Fulfillment"
            main_percentage="95%"
            percentage="5%"
            plus={true}
            iconBg="bg-web_yellow"
            bordercolor="border-web_yellow/50"
          />
          <InsightsCard
            icon={FaRegClock}
            title="On-Time Delivery"
            main_percentage="91%"
            percentage="8%"
            plus={true}
            iconBg="bg-deep_green"
            bordercolor="border-deep_green/50"
          />
          <div className="w-[300px] h-[180px] bg-[#1A1A1A]/40 rounded-[16px] border border-web_yellow/50 shadow-[0_4px_32px_0_rgba(0,0,0,0.25)] backdrop-blur-sm backdrop-saturate-150 overflow-hidden relative">
            <div className="absolute inset-0 flex flex-col px-5 items-start gap-2 justify-center text-white pointer-events-none">
              <div className="w-full flex items-center justify-between">
                <div
                  className={`text-purewhite bg-web_yellow rounded p-1 w-fit flex items-center justify-center`}
                >
                  <FaBuilding className="text-xl" />
                </div>
                <p className="text-web_yellow text-xs flex gap-1"> Active</p>
              </div>
              <p className="text-purewhite text-2xl">25</p>
              <p className="text-[#D1D5DB] text-base font-extralight">
                Inventory Level
              </p>
              <div className="absolute top-2 left-2 w-2/3 h-1/4 bg-white/20 rounded-full blur-lg"></div>
              <div className="absolute bottom-2 right-2 w-1/3 h-1/6 bg-white/10 rounded-full blur"></div>
            </div>
          </div>
        </div>
      </div>
      {/* Contact Section */}
      <div className="w-full py-10 flex flex-col bg-deep_green gap-3 items-center">
        <p className="text-purewhite text-3xl">
          Ready to Transform Your Construction Workflow?
        </p>
        <p className="text-light_gray text-base w-[600px] text-center">
          Join thousands of construction teams already using ConstructFlow to
          streamline their operations.
        </p>
        <div className="flex gap-4">
          <button className="bg-web_yellow font-medium text-main_dark px-6 py-3 rounded hover:bg-yellow-500 transition-colors">
            Start Managing Today
          </button>
          <button className="bg-transparent border font-medium border-purewhite text-purewhite px-6 py-3 rounded ">
            Learn More
          </button>
        </div>
      </div>
      {/* Footer */}
      <div className="w-full py-10 flex flex-col gap-3 items-center">
        <div className="w-full flex py-4 px-32 justify-between">
          <img
            src="/logo1.png"
            alt="Logo"
            className="md:h-16 h-10 md:w-[100px] object-contain"
          />
          <div className="flex flex-col gap-2">
            <p className="text-purewhite ">Product</p>
            <div className="flex flex-col gap-1">
              <p className="text-light_gray text-xs">Features</p>
              <p className="text-light_gray text-xs">Pricing</p>
              <p className="text-light_gray text-xs">Integrations</p>
              <p className="text-light_gray text-xs">API</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-purewhite ">Support</p>
            <div className="flex flex-col gap-1">
              <p className="text-light_gray text-xs">Help Center</p>
              <p className="text-light_gray text-xs">Documentation</p>
              <p className="text-light_gray text-xs">Training</p>
              <p className="text-light_gray text-xs">Contact Us</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-purewhite ">Contact</p>
            <div className="flex flex-col gap-1">
              <p className="flex gap-3 text-web_yellow text-xs"><IoMail/>support@constructflow.com</p>
              <p className="flex gap-3 text-web_yellow text-xs"><FaPhoneAlt/>+1 (555) 123-4567</p>
              <p className="flex gap-3 text-web_yellow text-xs"><MdLocationPin/>24/7 Support Available</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between w-3/4 mt-3 border-t pt-5 border-[#2E2F34]">
            <p className="text-light_gray text-xs">© 2024 ConstructFlow. All rights reserved.</p>
            <div className="flex gap-3">
            <p className="text-light_gray text-xs">Privacy Policy</p>
            <p className="text-light_gray text-xs">Terms of Service</p>
            <p className="text-light_gray text-xs">Cookie Policy</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
