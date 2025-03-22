using System.ComponentModel.DataAnnotations;

namespace DocumentsRegistry.API.Models;
public class Document
{

    [Required]
    public string RegistrationCode { get; set; } = string.Empty;

    [Required]
    public DateTime DateToSend { get; set; }

    [Required]
    [MaxLength(450)]
    public string DocumentCode { get; set; } = string.Empty;

    public byte DeliveryType { get; set; }

    [Required]
    public byte CorrespondentType { get; set; }

    [Required]
    [MaxLength(100)]
    public string Topic { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public DateTime Deadline { get; set; }

    [Required]
    public bool IsAvailable { get; set; }

    [Required]
    public bool IsControlled { get; set; }
}
