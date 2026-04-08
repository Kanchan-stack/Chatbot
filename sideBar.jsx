import React from 'react';
import { ShieldAlert, X, MapPin, Stethoscope, Phone, Heart, Pill, Lightbulb, HelpCircle } from 'lucide-react';
import { DISEASE_DATABASE } from '../data/knowledgeBase';

export default function Sidebar({ isOpen, onClose, onQuickAction }) {
  return (
    <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-teal-800 text-white transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 shadow-xl`}>
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2 font-bold text-xl">
            <ShieldAlert className="w-8 h-8 text-teal-300" />
            <span>HealthGuard</span>
          </div>
          <button onClick={onClose} className="md:hidden text-teal-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6">
          <div className="space-y-2">
            <h3 className="text-teal-200 text-xs font-bold uppercase tracking-wider">Quick Actions</h3>
            <button onClick={() => onQuickAction("Find hospitals near me")} className="w-full flex items-center space-x-3 p-3 bg-teal-700/50 hover:bg-teal-700 rounded-lg transition">
              <MapPin className="w-5 h-5 text-teal-300" />
              <span>Locate Clinics</span>
            </button>
            <button onClick={() => onQuickAction("I have fever and headache")} className="w-full flex items-center space-x-3 p-3 bg-teal-700/50 hover:bg-teal-700 rounded-lg transition">
              <Stethoscope className="w-5 h-5 text-teal-300" />
              <span>Symptom Check</span>
            </button>
            <button onClick={() => onQuickAction("Give me a health tip")} className="w-full flex items-center space-x-3 p-3 bg-teal-700/50 hover:bg-teal-700 rounded-lg transition">
              <Lightbulb className="w-5 h-5 text-teal-300" />
              <span>Health Tips</span>
            </button>
            <button onClick={() => onQuickAction("Tell me about medications")} className="w-full flex items-center space-x-3 p-3 bg-teal-700/50 hover:bg-teal-700 rounded-lg transition">
              <Pill className="w-5 h-5 text-teal-300" />
              <span>Medication Info</span>
            </button>
            <button onClick={() => onQuickAction("What can you do?")} className="w-full flex items-center space-x-3 p-3 bg-teal-700/50 hover:bg-teal-700 rounded-lg transition">
              <HelpCircle className="w-5 h-5 text-teal-300" />
              <span>Help</span>
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="text-teal-200 text-xs font-bold uppercase tracking-wider">Disease Info</h3>
            {Object.values(DISEASE_DATABASE).map(d => (
              <button key={d.name} onClick={() => onQuickAction(`Tell me about ${d.name}`)} className="w-full text-left p-2 hover:bg-teal-700 rounded text-sm text-teal-100 transition">
                {d.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-teal-700">
          <div className="flex items-center space-x-3 bg-red-500/20 p-3 rounded-lg border border-red-500/50">
            <Phone className="w-5 h-5 text-red-300" />
            <div>
              <p className="text-xs text-red-200">Emergency Helpline</p>
              <p className="font-bold text-white">Dial 108</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}