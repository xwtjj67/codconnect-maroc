interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, icon }: StatCardProps) => {
  return (
    <div className="glass-card p-5 flex items-center gap-4">
      <div className="h-12 w-12 rounded-xl gradient-teal flex items-center justify-center text-primary-foreground shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-muted-foreground text-sm">{title}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
