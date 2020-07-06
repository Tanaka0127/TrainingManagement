using Microsoft.EntityFrameworkCore;
using TrainingManagement.Models;

namespace TrainingManagement.Data
{
    public class MvcTrainingContext : DbContext
    {
        public MvcTrainingContext(DbContextOptions<MvcTrainingContext> options)
            : base(options)
        {
        }

        public DbSet<User> User { get; set; }
    }
}
