namespace sewers.Model;

public class WindowSchedule
{
    public DailyWindow? Monday { get; set; }
    public DailyWindow? Tuesday { get; set; }
    public DailyWindow? Wednesday { get; set; }
    public DailyWindow? Thursday { get; set; }
    public DailyWindow? Friday { get; set; }
    public DailyWindow? Saturday { get; set; }
    public DailyWindow? Sunday { get; set; }
}