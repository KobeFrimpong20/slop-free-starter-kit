import type { Rule } from "@/content/rules";

/** A rule's name, lint id, and slop/rule pair. Shared by the tour and the list. */
export function RuleDetails({ rule, size = "md" }: { rule: Rule; size?: "md" | "lg" }) {
  return (
    <>
      <div>
        <h3 className={`font-heading text-foreground ${size === "lg" ? "text-3xl" : "text-xl"}`}>
          {rule.name}
        </h3>
        <p className="mt-1 font-accent text-xs text-accent">slop-free/{rule.id}</p>
      </div>
      <dl className={`flex flex-col gap-3 font-body ${size === "lg" ? "text-base" : "text-sm"}`}>
        <div>
          <dt className="font-medium text-muted-foreground">The slop</dt>
          <dd className="mt-0.5 text-foreground">{rule.slop}</dd>
        </div>
        <div>
          <dt className="font-medium text-muted-foreground">The rule</dt>
          <dd className="mt-0.5 text-foreground">{rule.rule}</dd>
        </div>
      </dl>
    </>
  );
}
