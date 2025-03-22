using DocumentsRegistry.API.Data;
using DocumentsRegistry.API.Models.Entities;
using DocumentsRegistry.API.Models.Requests;
using DocumentsRegistry.API.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace DocumentsRegistry.API.Repositories;

public class DocumentsRepository : IDocumentsRepository
{
    private readonly ApplicationDbContext _context;

    public DocumentsRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Response> AddDocument(DocumentCreateRequest payload)
    {
        var fileName = payload.File.FileName;
        var documentEntity = new DocumentEntity()
        {
            CorrespondentType = payload.CorrespondentType,
            DateToSend = payload.DateToSend,
            Deadline = payload.Deadline,
            DeliveryType = payload.DeliveryType,
            Description = payload.Description,
            DocumentCode = payload.DocumentCode,
            FileName = fileName,
            IsAvailable = payload.IsAvailable,
            IsControlled = payload.IsControlled,
            RegistrationCode = payload.RegistrationCode,
            Topic = payload.Topic,
        };
        try
        {
            await _context.Documents.AddAsync(documentEntity);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            return new Response() { ErrorCode = 1, ErrorMessage = ex.Message };
            // log here too
        }
        return new Response(); // 0 ErrorCode and an empty ErrorMessage by default
    }

    public async Task<IEnumerable<DocumentGridItem>> GetAllDocuments()
    {
        return await _context.Documents.Select(document =>
            new DocumentGridItem()
            {
                CorrespondentType = document.CorrespondentType,
                DateToSend = document.DateToSend,
                DocumentCode = document.DocumentCode,
                FileName = document.FileName,
                RegistrationCode = document.RegistrationCode,
                RegistrationDate = document.RegistrationDate,
                Topic = document.Topic
            }
        ).OrderBy(document => document.RegistrationCode).ToListAsync();
    }

    public async Task<bool> CheckFileNameIsUnique(string fileName)
    {
        return !await _context.Documents.AnyAsync(document => document.FileName == fileName);
    }

    public async Task<bool> CheckRegistrationCodeIsUnique(string code)
    {
        return !await _context.Documents.AnyAsync(document => document.RegistrationCode == code);
    }
}
