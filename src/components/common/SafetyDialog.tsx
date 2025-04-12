
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield } from 'lucide-react';

interface SafetyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SafetyDialog: React.FC<SafetyDialogProps> = ({
  open,
  onOpenChange
}) => {
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-icc-blue flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Safety Guidelines
          </DialogTitle>
          <DialogDescription>
            Important safety practices for cryptocurrency users and reporters.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-center font-medium">2025 Edition</p>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">Updated with the latest crypto security best practices</p>
            </div>

            <h3 className="font-bold text-lg flex items-center gap-2 text-icc-blue">
              <Lock className="h-5 w-5" />
              1. Protecting Your Digital Assets
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-semibold">Use Hardware Wallets:</span> For significant holdings, use hardware wallets that keep your private keys offline. The 2025 models include advanced biometric authentication for additional security.</li>
              <li><span className="font-semibold">Multi-Factor Seed Phrases:</span> Consider using the new multi-factor seed phrase solutions that split your recovery phrase across multiple secure formats.</li>
              <li><span className="font-semibold">Never Share Private Keys:</span> Under no circumstances should you share your private keys or seed phrases with anyone, including platform representatives or support staff.</li>
              <li><span className="font-semibold">Implement Passphrase Security:</span> Add an extra passphrase (sometimes called a "25th word") to your seed for additional protection against physical theft.</li>
              <li><span className="font-semibold">Use Hardware Security Keys:</span> For exchange accounts, implement hardware security keys as a form of 2FA rather than relying solely on authenticator apps.</li>
              <li><span className="font-semibold">Enable Transaction Signing:</span> Utilize transaction signing requirements for all withdrawals, with mandatory time delays for large transfers.</li>
            </ul>
            
            <h3 className="font-bold text-lg flex items-center gap-2 text-icc-blue">
              <AlertTriangle className="h-5 w-5" />
              2. Recognizing Common Scams (2025 Update)
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-semibold">AI-Generated Deepfakes:</span> Be aware of increasingly sophisticated AI-generated video and audio impersonating known figures in the crypto space.</li>
              <li><span className="font-semibold">Smart Contract Exploits:</span> Review any contract interaction permissions carefully, as scammers now deploy contracts that gradually drain assets over time to avoid detection.</li>
              <li><span className="font-semibold">Advanced Phishing Techniques:</span> Verify websites using multiple methods, as scammers now employ perfect visual clones with nearly identical URLs and valid TLS certificates.</li>
              <li><span className="font-semibold">Recovery Scams:</span> Be cautious of services claiming they can recover stolen crypto, as these are often secondary scams targeting victims.</li>
              <li><span className="font-semibold">Liquidity Mining Traps:</span> Scrutinize DeFi protocols offering unusually high APYs, especially those requiring special token purchases or large deposits to "unlock rewards."</li>
              <li><span className="font-semibold">False Security Tools:</span> Only download security applications from verified sources, as fake security tools often contain malware designed to extract crypto keys.</li>
            </ul>
            
            <h3 className="font-bold text-lg flex items-center gap-2 text-icc-blue">
              <Search className="h-5 w-5" />
              3. Due Diligence Before Investing
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-semibold">Verify Team Identity:</span> Use the SEC's new identity verification registry to check if project team members have validated credentials and history.</li>
              <li><span className="font-semibold">Code Audit Status:</span> Confirm that smart contracts have been audited by multiple reputable security firms and check for recent updates to these audits.</li>
              <li><span className="font-semibold">On-Chain Analytics:</span> Utilize the new on-chain analytics tools to examine token distribution patterns and early holder behaviors before investing.</li>
              <li><span className="font-semibold">Community Assessment:</span> Evaluate the project's community engagement quality, not just quantity. Look for substantive technical discussions rather than price speculation.</li>
              <li><span className="font-semibold">Governance Structure:</span> Review the governance mechanism and voting history to ensure the project isn't controlled by a small group of insiders.</li>
              <li><span className="font-semibold">Risk Scoring:</span> Consult the SEC's risk assessment framework that provides standardized scoring for new crypto projects based on multiple factors.</li>
            </ul>
            
            <h3 className="font-bold text-lg flex items-center gap-2 text-icc-blue">
              <ClipboardCheck className="h-5 w-5" />
              4. Safe Reporting Practices
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-semibold">Evidence Preservation:</span> Use our new evidence collection tool that ensures cryptographic timestamps and preserves the chain of custody for all digital evidence.</li>
              <li><span className="font-semibold">Anonymous Reporting Options:</span> For whistleblowers, utilize our enhanced anonymity features that protect your identity while maintaining report credibility.</li>
              <li><span className="font-semibold">Standardized Documentation:</span> Follow the SEC's evidence documentation templates to ensure your reports meet the highest standards for verification.</li>
              <li><span className="font-semibold">Collaborative Reporting:</span> Consider using the new collaborative reporting feature for complex scams, allowing multiple victims to contribute to a single, comprehensive case file.</li>
              <li><span className="font-semibold">Counter-Intelligence Awareness:</span> Be vigilant against scammer retaliation tactics. Use separate, secure devices when gathering and submitting evidence.</li>
            </ul>
            
            <h3 className="font-bold text-lg flex items-center gap-2 text-icc-blue">
              <Wallet className="h-5 w-5" />
              5. Wallet Security (2025 Standards)
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-semibold">Wallet Segregation:</span> Maintain multiple wallets with different security levels - high-security cold storage for long-term holdings, medium-security for active trading, and low-security for frequent transactions.</li>
              <li><span className="font-semibold">Regular Security Audits:</span> Conduct monthly personal security audits using the SEC checklist to identify potential vulnerabilities in your wallet setup.</li>
              <li><span className="font-semibold">Approval Limits:</span> Set maximum transaction approval limits for DApps and revoke unnecessary permissions regularly using automated tools.</li>
              <li><span className="font-semibold">Multi-Signature Requirements:</span> For high-value holdings, implement multi-signature wallet arrangements requiring approval from multiple devices or individuals.</li>
              <li><span className="font-semibold">Hardware Wallet Verification:</span> Always verify transaction details on the hardware wallet screen, not just in the software interface.</li>
              <li><span className="font-semibold">Simulation Testing:</span> Use transaction simulation tools before executing high-value transfers to verify the expected outcome.</li>
            </ul>
            
            <h3 className="font-bold text-lg flex items-center gap-2 text-icc-blue">
              <Scale className="h-5 w-5" />
              6. Legal Considerations
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-semibold">Jurisdictional Awareness:</span> Understand that crypto regulations vary significantly by country. What's permitted in one jurisdiction may be restricted in another.</li>
              <li><span className="font-semibold">Documentation Standards:</span> Maintain comprehensive records of all transactions for tax compliance and potential fraud investigation purposes.</li>
              <li><span className="font-semibold">Cross-Border Reporting:</span> For international scams, consult our new cross-jurisdictional reporting guide to understand reporting requirements in multiple countries.</li>
              <li><span className="font-semibold">Evidence Admissibility:</span> Follow the SEC's legal evidence collection guidelines to ensure your documentation meets standards for legal proceedings.</li>
              <li><span className="font-semibold">Regulatory Compliance:</span> Stay informed about changing regulations in your jurisdiction that may affect your cryptocurrency activities and reporting obligations.</li>
            </ul>
            
            <h3 className="font-bold text-lg flex items-center gap-2 text-icc-blue">
              <FileText className="h-5 w-5" />
              7. Recovering from Scams
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-semibold">Immediate Response Protocol:</span> Follow the SEC's 7-step immediate response protocol when you suspect you've been scammed to minimize losses.</li>
              <li><span className="font-semibold">Asset Tracing Services:</span> Consider using blockchain forensics services that can track stolen assets across multiple chains and exchanges.</li>
              <li><span className="font-semibold">Exchange Cooperation:</span> Report stolen funds to exchanges using our standardized reporting template, increasing chances of asset freezing if the funds reach a centralized platform.</li>
              <li><span className="font-semibold">Recovery Specialists:</span> Consult the SEC's verified recovery specialist directory if seeking professional assistance with asset recovery.</li>
              <li><span className="font-semibold">Community Resources:</span> Join the SEC's victim support network for guidance from others who have experienced similar scams.</li>
              <li><span className="font-semibold">Psychological Support:</span> Access resources for dealing with the emotional impact of being scammed, including stress management and rebuilding trust.</li>
            </ul>
            
            <h3 className="font-bold text-lg flex items-center gap-2 text-icc-blue">
              <BadgeHelp className="h-5 w-5" />
              8. Emerging Threats (2025)
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-semibold">Layer 2 Vulnerabilities:</span> Be aware of new scams targeting Layer 2 solutions with fake bridge interfaces that steal funds during cross-chain transfers.</li>
              <li><span className="font-semibold">Validator Impersonation:</span> Verify staking providers thoroughly, as scammers are creating sophisticated fake staking platforms that mimic legitimate validator services.</li>
              <li><span className="font-semibold">Privacy Tools Exploits:</span> Exercise caution with new privacy tools that may contain backdoors designed to extract user information or funds.</li>
              <li><span className="font-semibold">Quantum-Resistant Messaging:</span> Consider utilizing quantum-resistant encryption for sensitive communications about high-value crypto holdings.</li>
              <li><span className="font-semibold">Social Recovery Manipulation:</span> If using social recovery wallets, implement additional verification steps to prevent social engineering of your trusted contacts.</li>
            </ul>
            
            <h3 className="font-bold text-lg flex items-center gap-2 text-icc-blue">
              <BookOpen className="h-5 w-5" />
              9. Educational Resources
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-semibold">SEC Learning Hub:</span> Access our comprehensive educational platform with interactive courses on crypto security and scam prevention.</li>
              <li><span className="font-semibold">Simulation Exercises:</span> Participate in scam simulation exercises to test your ability to identify and respond to various fraud attempts.</li>
              <li><span className="font-semibold">Community Workshops:</span> Join monthly virtual workshops covering emerging threats and defense strategies.</li>
              <li><span className="font-semibold">Developer Security Program:</span> For developers, enroll in our smart contract security certification program to build safer DApps.</li>
              <li><span className="font-semibold">Regular Security Bulletins:</span> Subscribe to the SEC's weekly security bulletin for updates on new scam methodologies and defense tactics.</li>
            </ul>
            
            <p className="mt-6 font-semibold text-center">
              Remember that staying informed is your best defense against scams. Regularly update yourself on the latest security practices and scam techniques in the cryptocurrency space.
            </p>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              © 2025 Scams & E-crimes Commission | Safety Guidelines v3.2 | April 2025
            </p>
          </div>
        </ScrollArea>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="neutral" className="text-icc-blue hover:bg-gray-100">I Understand</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
};

export default SafetyDialog;
