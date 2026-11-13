'use client';

import React from 'react';
import { X, Cpu, Database, Zap, Shield, Layers, Server } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
        <div className="sticky top-0 bg-white/95 backdrop-blur-md p-6 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-cyan-400 shadow">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">High-Throughput Distributed Architecture</h3>
              <p className="text-xs text-slate-500">CompareCart Scale Blueprint (10,000+ Requests/Sec)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs text-slate-600">
          {/* Architecture Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>1. In-Memory Deal Optimization Engine</span>
              </div>
              <p>
                Calculates <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">Effective Price = Listed − Coupon − Card Benefit</code> as a pure stateless in-memory function.
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-500">
                <li>Complexity: O(M × (C + B)) where M is merchants, C coupons, B bank offers.</li>
                <li>Latency: <strong>&lt; 1 ms per evaluation</strong> without database bottlenecks.</li>
                <li>Throughput: 50,000+ deal evaluations per second per node.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Database className="w-4 h-4 text-blue-500" />
                <span>2. Multi-Tier Distributed Caching</span>
              </div>
              <p>
                Read-heavy shopping discovery is isolated from transactional database writes using a dual-tier cache.
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-500">
                <li><strong>L1 In-Memory Cache:</strong> Hot product price tables kept in worker node memory.</li>
                <li><strong>L2 Redis Cluster:</strong> Global distributed price history and coupon states.</li>
                <li>Cache Hit Ratio: <strong>99.4%</strong> under surge traffic (e.g. Big Billion Days).</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>3. Concurrency-Safe Partner Matcher</span>
              </div>
              <p>
                Partner credit limit allocations use distributed atomic locks to prevent race conditions.
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-500">
                <li>Atomic Redis Lua scripts decrement partner card limit during matching.</li>
                <li>Rolls back automatically if buyer escrow is not received within 15 minutes.</li>
                <li>Priority sorting: Trust Score × Limit Availability × Billing Proximity.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Layers className="w-4 h-4 text-purple-500" />
                <span>4. Event-Driven Escrow State Machine</span>
              </div>
              <p>
                Transaction transitions are verified via asynchronous message workers (Kafka/RabbitMQ).
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-500">
                <li>Idempotent Webhook handlers for UPI QR payments.</li>
                <li>Automatic tracking polling (AWB courier API) for delivery confirmation.</li>
                <li>7-day return window lock before escrow disbursement.</li>
              </ul>
            </div>
          </div>

          {/* ASCII / Visual Flow */}
          <div className="bg-slate-900 text-slate-300 p-4 rounded-2xl font-mono text-[11px] leading-relaxed border border-slate-800">
            <div className="text-cyan-400 font-bold mb-2">// HIGH-THROUGHPUT PIPELINE</div>
            <div>[Shopper Search] ──(99.4% Hit)──&gt; [Edge CDN / Redis Cache]</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼</div>
            <div>[Deal Engine] ──(&lt;1ms reduction)─&gt; [Best Merchant + Card Ranked]</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│ (Partner Card Selected)</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼</div>
            <div>[Atomic Matchmaker] ──(Distributed Lock)──&gt; [Cardholder Matched]</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼</div>
            <div>[Nodal Escrow Gateway] ──(Webhook Verification)──&gt; [Ledger Locked]</div>
          </div>
        </div>
      </div>
    </div>
  );
};
