
import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import { Shield, Target, Users, Globe, Zap, Heart } from 'lucide-react';

const VisionPage = () => {
  return (
    <DocsContent 
      title="Vision & Mission" 
      description="Understanding the core values and objectives that drive the SEC platform"
    >
      <div className="space-y-8">
        {/* Vision Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Target className="h-8 w-8 text-icc-gold" />
            <h2 className="text-3xl font-bold">Our Vision</h2>
          </div>
          <div className="bg-gradient-to-r from-icc-blue to-icc-blue-light rounded-lg p-8 text-white mb-6">
            <p className="text-xl leading-relaxed">
              The SEC envisions a self-regulated, safer crypto space where bad actors are discouraged 
              through transparency and community vigilance. We strive to create an ecosystem where 
              legitimate projects thrive while scammers are exposed and held accountable.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <Globe className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Global Impact</h3>
              <p>Creating a worldwide network of fraud prevention that transcends borders and jurisdictions.</p>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <Shield className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Trust & Safety</h3>
              <p>Building trust in the digital economy through transparent reporting and community verification.</p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Zap className="h-8 w-8 text-icc-gold" />
            <h2 className="text-3xl font-bold">Our Mission</h2>
          </div>
          <div className="bg-muted rounded-lg p-6 mb-6">
            <p className="text-lg">
              The platform's mission is to equip users with decentralized tools that help identify 
              and expose scams through token-based incentives and active community participation.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Core Objectives:</h3>
            <div className="grid gap-4">
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <Users className="h-6 w-6 text-icc-gold mt-1" />
                <div>
                  <h4 className="font-semibold">Community Empowerment</h4>
                  <p className="text-muted-foreground">Enable every user to contribute to a safer digital ecosystem through reporting and verification.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <Shield className="h-6 w-6 text-icc-gold mt-1" />
                <div>
                  <h4 className="font-semibold">Scam Prevention</h4>
                  <p className="text-muted-foreground">Proactively identify and expose fraudulent activities before they can harm more victims.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <Heart className="h-6 w-6 text-icc-gold mt-1" />
                <div>
                  <h4 className="font-semibold">Victim Support</h4>
                  <p className="text-muted-foreground">Provide resources and community support for those who have been affected by scams.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Core Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-icc-gold">Transparency</h3>
              <p>All actions and reports are visible to the community, ensuring accountability and trust.</p>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-icc-gold">Decentralization</h3>
              <p>No single authority controls the platform - power belongs to the community.</p>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-icc-gold">Collaboration</h3>
              <p>Working together to create a safer digital environment for everyone.</p>
            </div>
          </div>
        </section>
      </div>
    </DocsContent>
  );
};

export default VisionPage;
