using DocumentsRegistry.API.Data;
using DocumentsRegistry.API.Models.Entities;
using DocumentsRegistry.API.Models.Requests;
using DocumentsRegistry.API.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace DocumentsRegistry.API.Repositories;

public class DocumentsRepository : IDocumentsRepository
{
    private readonly ApplicationDbContext _context;
    private readonly IBlobStorageRepository _blobStorage;

    public DocumentsRepository(ApplicationDbContext context, IBlobStorageRepository blobStorage)
    {
        _context = context;
        _blobStorage = blobStorage;
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
            await _blobStorage.UploadToBlobContainerAsync(payload.File);
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

    public async Task<DocumentEntity?> GetDetailsByRegistrationCode(string registrationCode)
    {
        return await _context.Documents.FindAsync(registrationCode);
    }

    public async Task<Response> UpdateDocument(string registrationCode, DocumentUpdateRequest payload)
    {
        var document = await GetDetailsByRegistrationCode(registrationCode);
        if (document is null)
        {
            return new Response { ErrorCode = 1, ErrorMessage = $"Couldn't find document with registrationCode: {registrationCode}" };
        }
        document.DateToSend = payload.DateToSend;
        document.DocumentCode = payload.DocumentCode;
        document.DeliveryType = payload.DeliveryType;
        document.CorrespondentType = payload.CorrespondentType;
        document.Topic = payload.Topic;
        document.Description = payload.Description;
        document.Deadline = payload.Deadline;
        document.IsAvailable = payload.IsAvailable;
        document.IsControlled = payload.IsControlled;
        _context.Update(document);
        await _context.SaveChangesAsync();
        return new Response();
    }
}
