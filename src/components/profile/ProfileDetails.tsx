import type { ReactNode } from "react";
import { Briefcase, Filter, House, Mail, Phone, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { UserDetails } from "@/utils/interfaces";
import { aboutRows, careerRows, familyRows, preferenceRows, type Row } from "@/lib/profileRows";

const isEmpty = (v: Row[1]) => v === undefined || v === "" || (Array.isArray(v) && !v.length);

const chips = (values: string[]) => (
  <span className="flex flex-wrap gap-1">
    {values.map((v) => (
      <Badge key={v} variant="secondary" className="font-medium">
        {v}
      </Badge>
    ))}
  </span>
);

export const DetailSection = ({
  icon,
  title,
  rows,
  note,
}: {
  icon: ReactNode;
  title: string;
  rows: Row[];
  note?: string;
}) => {
  const visible = rows.filter(([, v]) => !isEmpty(v));
  if (!visible.length && !note) return null;
  return (
    <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <h3 className="mb-3 flex items-center gap-2 font-display text-xl font-bold">
        <span className="flex size-8 items-center justify-center rounded-full bg-accent text-primary [&_svg]:size-4">
          {icon}
        </span>
        {title}
      </h3>
      {note && (
        <p className="mb-4 whitespace-pre-line rounded-xl border-l-4 border-gold bg-accent/60 px-3 py-2.5 text-sm italic text-foreground/85">
          {note}
        </p>
      )}
      <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        {visible.map(([k, v]) => (
          <div key={k} className="min-w-0">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{k}</dt>
            <dd className="mt-0.5 break-words text-sm font-medium text-foreground">{Array.isArray(v) ? chips(v) : v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};


export const ContactCard = ({ user }: { user: UserDetails }) => {
  const { basic } = user;
  if (!basic.mobile && !basic.email) return null;
  return (
    <div className="rounded-2xl border border-success/30 bg-success/8 p-4">
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-success">Contact details</p>
      <div className="flex flex-col gap-2 text-sm font-semibold">
        {basic.mobile && (
          <a href={`tel:+91${basic.mobile}`} className="flex items-center gap-2 hover:underline">
            <Phone className="size-4 text-success" /> +91 {basic.mobile}
          </a>
        )}
        {basic.alternateMob && (
          <a href={`tel:+91${basic.alternateMob}`} className="flex items-center gap-2 hover:underline">
            <Phone className="size-4 text-success" /> +91 {basic.alternateMob}
            <span className="font-normal text-muted-foreground">(alternate)</span>
          </a>
        )}
        {basic.email && (
          <a href={`mailto:${basic.email}`} className="flex items-center gap-2 break-all hover:underline">
            <Mail className="size-4 text-success" /> {basic.email}
          </a>
        )}
      </div>
    </div>
  );
};

export const AboutSections = ({ user }: { user: UserDetails }) => (
  <>
    <DetailSection icon={<UserRound />} title="About" note={user.basic.note} rows={aboutRows(user)} />
    <DetailSection icon={<Briefcase />} title="Education & career" note={user.personal?.note} rows={careerRows(user)} />
  </>
);

export const FamilySection = ({ user }: { user: UserDetails }) => (
  <DetailSection icon={<House />} title="Family" note={user.family?.note} rows={familyRows(user)} />
);

export const PreferencesSection = ({ user }: { user: UserDetails }) => (
  <DetailSection icon={<Filter />} title="Looking for" note={user.partner?.note} rows={preferenceRows(user)} />
);
