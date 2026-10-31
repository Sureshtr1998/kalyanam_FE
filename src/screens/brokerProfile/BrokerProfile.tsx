import { useEffect, useState } from "react";
import { Building2, Mail, MapPin, Phone, Share2, Users } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/common/PageHeader";
import api from "@/utils/api";
import type { BrokerRegistrationForm } from "@/utils/brokerInterface";
import { errorMessage } from "@/lib/errors";
import { motherTongueOptions, normalizeToArray } from "@/utils/utils";

const BrokerProfile = () => {
  const [broker, setBroker] = useState<BrokerRegistrationForm | null>(null);

  useEffect(() => {
    api
      .get("/broker/me")
      .then((res) => setBroker(res.data.profile))
      .catch((err) => toast.error("Couldn't load profile", { description: errorMessage(err) }));
  }, []);

  if (!broker) return <Skeleton className="mx-auto h-96 max-w-3xl rounded-3xl" />;

  const langs = normalizeToArray(broker.motherTongue).map(
    (v) => motherTongueOptions.find((o) => o.value === v)?.label ?? v
  );

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Matchmaker profile"
        description="Track your referrals and manage your agency presence on Seetha Rama Kalyana."
      />
      <Card className="overflow-hidden border-gold/30">
        <div className="bg-kolam bg-gradient-to-r from-primary/10 via-accent to-gold/20 p-6">
          <p className="font-display text-3xl font-bold">{broker.name}</p>
          <p className="text-sm text-muted-foreground">{broker.companyName}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="rounded-xl bg-card px-4 py-2 shadow-sm">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Referral ID</p>
              <p className="flex items-center gap-1.5 font-mono text-lg font-bold text-primary">
                <Share2 className="size-4" />
                {broker.referralId ?? "Awaiting approval"}
              </p>
            </div>
            <div className="rounded-xl bg-card px-4 py-2 shadow-sm">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Members referred</p>
              <p className="flex items-center gap-1.5 text-lg font-bold">
                <Users className="size-4 text-gold" />
                {broker.usersReferred ?? 0}
              </p>
            </div>
          </div>
        </div>
        <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
          <p className="flex items-center gap-2 text-sm"><Mail className="size-4 text-gold" />{broker.email}</p>
          <p className="flex items-center gap-2 text-sm"><Phone className="size-4 text-gold" />{broker.phone}</p>
          <p className="flex items-center gap-2 text-sm sm:col-span-2"><MapPin className="size-4 text-gold" />{broker.address || "-"}</p>
          <div className="sm:col-span-2">
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground"><Building2 className="size-4" />Communities served</p>
            <div className="flex flex-wrap gap-1.5">
              {normalizeToArray(broker.caste).map((c) => <Badge key={c} variant="secondary">{c}</Badge>)}
              {langs.map((l) => <Badge key={l} variant="outline">{l}</Badge>)}
            </div>
          </div>
          {broker.note && <p className="rounded-xl bg-muted p-3 text-sm italic sm:col-span-2">“{broker.note}”</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default BrokerProfile;
